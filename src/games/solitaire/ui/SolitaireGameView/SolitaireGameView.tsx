import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { Lightbulb, Undo2 } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'

import { HINT_STYLE } from '@/shared/game/assists.constants'
import { formatDuration } from '@/shared/lib/format.functions'
import { useGameTimer } from '@/shared/game/gameTimer.hooks'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { DECK, VERDICT } from '@/games/solitaire/engine/solitaire.constants'
import {
  autoFinishMoves,
  boardOf,
  canAutoFinish,
  cycledStock,
  gameWon,
  lostMoveProbe,
  narrowLostMove,
  restart,
  dropCards,
  tapCard,
  tapEmptyPile,
  tapStock,
  undo,
} from '@/games/solitaire/engine/solitaire.functions'
import { useSolitaireGames } from '@/games/solitaire/engine/solitaire.hooks'
import type {
  Move,
  SolitaireGame,
} from '@/games/solitaire/engine/solitaire.types'
import {
  cardCount,
  cardsIn,
} from '@/games/solitaire/engine/solitaireBoard.functions'
import { findHint } from '@/games/solitaire/engine/solitaireHint.functions'
import {
  decodeBoard,
  decodeMoves,
  encodeMoves,
} from '@/games/solitaire/engine/solitaireCodec.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/games/solitaire/engine/solitaireSaves.constants'
import { dealTitle } from '@/games/solitaire/engine/solitaireSaves.functions'
import type { SolitaireSettings } from '@/games/solitaire/engine/solitaireSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/shared/ui/Button/Button.constants'
import { hintMessage } from '@/games/solitaire/ui/PlayingCard/PlayingCard.functions'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { SolitaireTable } from '@/games/solitaire/ui/SolitaireTable/SolitaireTable'

const FINISH_STEP_MS = 110

const TUTORIAL = [
  {
    target: '[aria-label="Column 1"]',
    text: 'Build down the seven columns in alternating colours. Only a King, or a run starting with one, can go in an empty column.',
  },
  {
    target: '[aria-label^="Stock"]',
    text: 'Tap the stock to turn cards onto the waste. When it runs out, tap again to turn the waste over.',
  },
  {
    target: '[aria-label^="Foundation"]',
    text: 'Build each suit up from Ace to King here. Fill all four to win.',
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Tap a card to send it to the best place, or drag it. Stuck? The bulb suggests a move.',
  },
]

export function SolitaireGameView({ id }: { id: string }) {
  const { games, startRandom, saveProgress, finish, checkWinnable } =
    useSolitaireGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<SolitaireSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<SolitaireGame | null>(() =>
    saved
      ? {
          start: decodeBoard(saved.board),
          drawMode: saved.drawMode,
          order: saved.order,
          moves: decodeMoves(saved.moves),
          selection: null,
          oneTapMove: true,
        }
      : null,
  )
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [unwinnable, setUnwinnable] = useState(false)
  const [lastWinnable, setLastWinnable] = useState(0)
  const [searching, setSearching] = useState(false)
  const [finishing, setFinishing] = useState<Move[]>([])
  const finishStep = useEffectEvent(() => {
    const [next, ...rest] = finishing
    setFinishing(rest)
    update((state) => ({
      ...state,
      moves: [...state.moves, next],
      selection: null,
    }))
  })

  useEffect(() => {
    if (finishing.length === 0) {
      return
    }
    const timer = setTimeout(finishStep, FINISH_STEP_MS)
    return () => clearTimeout(timer)
  }, [finishing])
  const won = game !== null && gameWon(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !won,
  })

  if (!saved || !game) {
    return (
      <GameNotFound
        title={TITLE}
        back={[GAME_ROUTE.SOLITAIRE]}
        message="This game could not be found."
      />
    )
  }

  const current: SolitaireGame = { ...game, oneTapMove: settings.oneTapMove }
  const board = boardOf(current)

  function check(next: SolitaireGame) {
    const nextBoard = boardOf(next)
    if (
      !settings.warnUnwinnable ||
      !cycledStock(next) ||
      gameWon(next) ||
      cardCount(nextBoard) !== DECK.length
    ) {
      return
    }
    const moves = next.moves.length
    checkWinnable({
      board: nextBoard,
      drawMode: next.drawMode,
      order: next.order,
    }).then((reply) => {
      if (reply.verdict === VERDICT.WINNABLE) {
        setLastWinnable(moves)
      } else if (reply.verdict === VERDICT.UNWINNABLE) {
        setUnwinnable(true)
        void findLostMove({
          game: next,
          range: { winnable: Math.min(lastWinnable, moves), lost: moves },
        })
      }
    })
  }

  async function findLostMove({
    game: lostGame,
    range,
  }: {
    game: SolitaireGame
    range: { winnable: number; lost: number }
  }) {
    setSearching(true)
    let narrowed = range
    for (
      let probe = lostMoveProbe(narrowed);
      probe !== null;
      probe = lostMoveProbe(narrowed)
    ) {
      const reply = await checkWinnable({
        board: boardOf({ ...lostGame, moves: lostGame.moves.slice(0, probe) }),
        drawMode: lostGame.drawMode,
        order: lostGame.order,
      })
      narrowed = narrowLostMove({
        range: narrowed,
        probe,
        verdict: reply.verdict,
      })
    }
    setLastWinnable(narrowed.winnable)
    setSearching(false)
  }

  function onHint() {
    const found = findHint(current)
    if (found === null) {
      setHint('No moves left.')
      return
    }
    const { selection, to } = found
    if (selection === null || to === null) {
      if (settings.hintStyle === HINT_STYLE.FILL) {
        update(tapStock)
        return
      }
      setHint('Nothing on the table can move, so draw from the stock.')
      return
    }
    const cards = cardsIn({ board, pile: selection.pile })
    const index = cards.length - selection.count
    if (settings.hintStyle === HINT_STYLE.FILL) {
      update((state) =>
        dropCards({ game: state, from: selection.pile, index, to }),
      )
      return
    }
    setGame({ ...current, selection })
    setHint(hintMessage({ board, selection, to }))
  }

  function update(change: (state: SolitaireGame) => SolitaireGame) {
    if (!saved) {
      return
    }
    const next = change(current)
    setGame(next)
    setHint(null)
    if (next.moves === current.moves) {
      return
    }
    setUnwinnable(false)
    const patch = {
      moves: encodeMoves(next.moves),
      moveCount: next.moves.length,
      elapsedMs: elapsedMs(),
    }
    if (gameWon(next)) {
      setResult({ newBest: finish({ id: saved.id, patch, won: true }) })
      return
    }
    saveProgress({ id: saved.id, patch })
    check(next)
  }

  function giveUp() {
    if (!saved) {
      return
    }
    finish({
      id: saved.id,
      patch: { elapsedMs: elapsedMs() },
      won: false,
    })
    navigate([GAME_ROUTE.SOLITAIRE])
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-2 pb-6">
      <div className="w-full px-2">
        <ScreenHeader
          title={dealTitle(saved)}
          subtitle={[
            settings.showTimer ? formatDuration(elapsedMs()) : null,
            settings.showMoveCount ? `Moves ${current.moves.length}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          back={[GAME_ROUTE.SOLITAIRE]}
        >
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last move"
            disabled={current.moves.length === 0 || won}
            onClick={() => update(undo)}
          >
            <Undo2 className="size-5" />
          </Button>
          {settings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a hint"
              disabled={won}
              onClick={onHint}
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {settings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>Move every card up to the four foundations, Ace to King.</p>
              <p>
                In the columns, build down in alternating colours. Any face-up
                run can move together.
              </p>
              <p>Only a King can fill an empty column.</p>
              <p>Tap a card to send it to the best place, or drag it.</p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              {
                label: 'Restart this deal',
                onClick: () => !won && update(restart),
              },
              { label: 'New deal', onClick: () => void startRandom() },
              {
                label: 'Settings',
                onClick: () =>
                  navigate([GAME_ROUTE.SOLITAIRE, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      {canAutoFinish(current) && (
        <Button
          className="w-full max-w-xl"
          disabled={finishing.length > 0}
          onClick={() => setFinishing(autoFinishMoves(current))}
        >
          Finish
        </Button>
      )}
      <SolitaireTable
        board={board}
        finishing={finishing.length > 0}
        drawMode={current.drawMode}
        selection={current.selection}
        onStock={() => update(tapStock)}
        onCard={({ pile, index }) =>
          update((state) => tapCard({ game: state, pile, index }))
        }
        onEmpty={(pile) =>
          update((state) => tapEmptyPile({ game: state, pile }))
        }
        onDrop={({ from, index, to }) =>
          update((state) => dropCards({ game: state, from, index, to }))
        }
      />
      <p className="h-6 text-sm font-semibold" role="status">
        {hint ?? ''}
      </p>
      <AppDialog
        open={unwinnable && !won}
        title="This deal can't be won now"
        onClose={() => setUnwinnable(false)}
        actions={
          <>
            <Button
              disabled={searching}
              onClick={() =>
                update((state) => ({
                  ...state,
                  moves: state.moves.slice(0, lastWinnable),
                  selection: null,
                }))
              }
            >
              {searching
                ? 'Finding where it went wrong…'
                : lastWinnable === 0
                  ? 'Start the deal again'
                  : `Undo ${current.moves.length - lastWinnable} moves`}
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => setUnwinnable(false)}
            >
              Keep playing
            </Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={giveUp}>
              Give up
            </Button>
          </>
        }
      >
        <p>
          You've been through the whole stock with nothing new to play, so the
          solver checked every line from here: none of them wins.
        </p>
        {!searching && lastWinnable > 0 && (
          <p>
            It could still be won up to move {lastWinnable}. Move{' '}
            {lastWinnable + 1} is where it slipped away.
          </p>
        )}
      </AppDialog>
      <WinDialog
        open={result !== null}
        title="You won!"
        accent={MENU_ACCENT.SOLITAIRE}
        route={GAME_ROUTE.SOLITAIRE}
        newLabel="Deal"
        onNew={() => void startRandom()}
        newBest={result?.newBest ?? false}
        stats={[
          { label: 'Time', value: formatDuration(elapsedMs()) },
          { label: 'Moves', value: current.moves.length },
        ]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => navigate([GAME_ROUTE.SOLITAIRE])}>Home</Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.SOLITAIRE} />
    </main>
  )
}
