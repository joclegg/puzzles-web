import { Undo2 } from 'lucide-react'
import { useState } from 'react'

import { formatDuration } from '@/common/format.functions'
import { useGameTimer } from '@/common/gameTimer.hooks'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { DECK, VERDICT } from '@/common/solitaire/solitaire.constants'
import {
  autoFinish,
  boardOf,
  canAutoFinish,
  cycledStock,
  gameWon,
  restart,
  tapCard,
  tapEmptyPile,
  tapStock,
  undo,
} from '@/common/solitaire/solitaire.functions'
import { useSolitaireGames } from '@/common/solitaire/solitaire.hooks'
import type { SolitaireGame } from '@/common/solitaire/solitaire.types'
import { cardCount } from '@/common/solitaire/solitaireBoard.functions'
import {
  decodeBoard,
  decodeMoves,
  encodeMoves,
} from '@/common/solitaire/solitaireCodec.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/common/solitaire/solitaireSaves.constants'
import { dealTitle } from '@/common/solitaire/solitaireSaves.functions'
import type { SolitaireSettings } from '@/common/solitaire/solitaireSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SolitaireTable } from '@/components/SolitaireTable/SolitaireTable'

export function SolitaireGameView({ id }: { id: number }) {
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
  const [unwinnable, setUnwinnable] = useState(false)
  const [lastWinnable, setLastWinnable] = useState(0)
  const won = game !== null && gameWon(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !won,
  })

  if (!saved || !game) {
    return (
      <main className="mx-auto max-w-md px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.SOLITAIRE]} />
        <p>This game could not be found.</p>
      </main>
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
      }
    })
  }

  function update(change: (state: SolitaireGame) => SolitaireGame) {
    if (!saved) {
      return
    }
    const next = change(current)
    setGame(next)
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
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center gap-3 px-2 pb-6">
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
      <SolitaireTable
        board={board}
        drawMode={current.drawMode}
        selection={current.selection}
        onStock={() => update(tapStock)}
        onCard={({ pile, index }) =>
          update((state) => tapCard({ game: state, pile, index }))
        }
        onEmpty={(pile) =>
          update((state) => tapEmptyPile({ game: state, pile }))
        }
      />
      {canAutoFinish(current) && (
        <Button onClick={() => update(autoFinish)}>Finish</Button>
      )}
      <AppDialog
        open={unwinnable && !won}
        title="This deal can't be won now"
        onClose={() => setUnwinnable(false)}
        actions={
          <>
            <Button onClick={() => setUnwinnable(false)}>Keep playing</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={giveUp}>
              Give up
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() =>
                update((state) => ({
                  ...state,
                  moves: state.moves.slice(0, lastWinnable),
                  selection: null,
                }))
              }
            >
              Undo to winnable
            </Button>
          </>
        }
      >
        <p>
          No sequence of moves from here wins. Undo back to the last position
          that could still be won, or start a new deal.
        </p>
      </AppDialog>
      <AppDialog
        open={result !== null}
        title="You won!"
        onClose={() => setResult(null)}
        actions={
          <>
            <Button onClick={() => navigate([GAME_ROUTE.SOLITAIRE])}>
              Home
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => void startRandom()}
            >
              New deal
            </Button>
          </>
        }
      >
        {result?.newBest && <p className="font-bold text-primary">New best!</p>}
        <p>Time {formatDuration(elapsedMs())}</p>
        <p>Moves {current.moves.length}</p>
      </AppDialog>
    </main>
  )
}
