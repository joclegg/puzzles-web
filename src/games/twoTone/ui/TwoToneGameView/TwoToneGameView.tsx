import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { RevealDialog } from '@/shared/game/RevealDialog/RevealDialog'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { formatDuration } from '@/shared/lib/format.functions'
import { ArrowLeftRight, Lightbulb, Undo2, CircleDot } from 'lucide-react'
import { useState } from 'react'

import { useGameTimer } from '@/shared/game/gameTimer.hooks'
import {
  revealPuzzle,
  solvePuzzle,
  updatePuzzle,
} from '@/shared/game/puzzleSaves.functions'
import { puzzleTitle } from '@/shared/game/puzzleTitle.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { HINT_KIND, TILE } from '@/games/twoTone/engine/twoTone.constants'
import {
  encodeChanges,
  gameBrokenCells,
  hintMessage,
  hintTargets,
  hintTwin,
  isSolved,
  newGame,
  paint,
  progressPercent,
  replay,
  tap,
  undo,
  withHint,
} from '@/games/twoTone/engine/twoTone.functions'
import { useTwoToneGames } from '@/games/twoTone/engine/twoTone.hooks'
import type { Tile, TwoToneGame } from '@/games/twoTone/engine/twoTone.types'
import { decodePuzzle } from '@/games/twoTone/engine/twoToneGenerator.functions'
import { decodeChanges } from '@/games/twoTone/engine/twoTone.functions'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
  TITLE,
} from '@/games/twoTone/engine/twoToneSettings.constants'
import type { TwoToneSettings } from '@/games/twoTone/engine/twoToneSettings.types'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { GameStatusBar } from '@/shared/game/GameStatusBar/GameStatusBar'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { TwoToneBoard } from '@/games/twoTone/ui/TwoToneBoard/TwoToneBoard'
import { TwoToneColourPicker } from '@/games/twoTone/ui/TwoToneColourPicker/TwoToneColourPicker'

const TUTORIAL = [
  {
    target: '[aria-label="Board"]',
    text: 'Tap a tile to cycle it red, blue, empty. No three of a colour in a line, and every row and column is half red, half blue.',
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Stuck? The bulb points at the next step and explains it.',
  },
  {
    target: '[aria-label="More"]',
    text: 'Restart, show the solution and settings live in this menu.',
  },
]

export function TwoToneGameView({ id }: { id: string }) {
  const { games, setGames, startRandom } = useTwoToneGames()
  const saved = games.find((game) => game.id === id)
  const [settings, setSettings] = useStoredState<TwoToneSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<TwoToneGame | null>(() =>
    saved
      ? replay({
          puzzle: decodePuzzle(saved.puzzle),
          changes: decodeChanges(saved.changes),
        })
      : null,
  )
  const [hints, setHints] = useState(saved?.hints ?? 0)
  const [colour, setColour] = useState<Tile>(TILE.RED)
  const [showGivens, setShowGivens] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })

  if (!saved || !game) {
    return (
      <GameNotFound
        title={TITLE}
        back={[GAME_ROUTE.TWO_TONE]}
        message="This puzzle could not be found."
      />
    )
  }

  function persist({
    next,
    hintCount,
  }: {
    next: TwoToneGame
    hintCount: number
  }) {
    if (!saved) {
      return
    }
    const changes = encodeChanges(next.changes)
    if (isSolved(next)) {
      const finished = solvePuzzle({
        games,
        id: saved.id,
        elapsedMs: elapsedMs(),
        changes,
        hints: hintCount,
        now: Date.now(),
      })
      setGames(() => finished.games)
      setResult({ newBest: finished.newBest })
      return
    }
    setGames((current) =>
      updatePuzzle({
        games: current,
        id: saved.id,
        patch: { changes, hints: hintCount, elapsedMs: elapsedMs() },
      }),
    )
  }

  function move(change: (current: TwoToneGame) => TwoToneGame) {
    if (!game) {
      return
    }
    const next = change(game)
    setGame(next)
    if (next.changes !== game.changes) {
      persist({ next, hintCount: hints })
    }
  }

  function onTile(cell: number) {
    move((current) =>
      settings.inputMode === INPUT_MODE.PICK_COLOUR
        ? paint({ game: current, cell, colour })
        : tap({ game: current, cell }),
    )
  }

  function onHint() {
    if (!game || solved) {
      return
    }
    if (game.hint !== null) {
      setGame({ ...game, hint: null })
      return
    }
    const next = withHint(game)
    setGame(next)
    setHints(hints + 1)
    persist({ next, hintCount: hints + 1 })
  }

  function onReveal() {
    if (!game || !saved) {
      return
    }
    setGame({ ...game, grid: game.puzzle.solution, hint: null })
    setRevealing(false)
    setGames((current) =>
      revealPuzzle({
        games: current,
        id: saved.id,
        elapsedMs: elapsedMs(),
        now: Date.now(),
      }),
    )
  }

  function onRestart() {
    if (!game || solved) {
      return
    }
    const next = newGame(game.puzzle)
    setGame(next)
    setHints(0)
    persist({ next, hintCount: 0 })
  }

  const hint = game.hint
  const hintLine =
    hint?.kind === HINT_KIND.NEXT ? new Set(hint.cells) : new Set<number>()

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-4 pb-6">
      <div className="w-full">
        <ScreenHeader title={puzzleTitle(saved)} back={[GAME_ROUTE.TWO_TONE]}>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last tap"
            disabled={game.changes.length === 0 || solved}
            onClick={() => move(undo)}
          >
            <Undo2 className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label={
              showGivens ? 'Hide the starting tiles' : 'Show the starting tiles'
            }
            className={showGivens ? 'bg-muted' : undefined}
            onClick={() => setShowGivens(!showGivens)}
          >
            <CircleDot className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label={
              settings.inputMode === INPUT_MODE.PICK_COLOUR
                ? 'Pick a colour'
                : 'Tap to cycle'
            }
            aria-pressed={settings.inputMode === INPUT_MODE.PICK_COLOUR}
            className={
              settings.inputMode === INPUT_MODE.PICK_COLOUR
                ? 'bg-muted'
                : undefined
            }
            onClick={() =>
              setSettings((current) => ({
                ...current,
                inputMode:
                  current.inputMode === INPUT_MODE.PICK_COLOUR
                    ? INPUT_MODE.TAP_TO_CYCLE
                    : INPUT_MODE.PICK_COLOUR,
              }))
            }
          >
            <ArrowLeftRight className="size-5" />
          </Button>
          {settings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a hint"
              disabled={solved}
              onClick={onHint}
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {settings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>
                Fill every tile red or blue. Tap a tile to cycle it: red, blue,
                empty.
              </p>
              <p>
                No three tiles of the same colour next to each other in a row or
                column.
              </p>
              <p>Every row and column has as many red tiles as blue.</p>
              <p>No two rows are the same, and no two columns are the same.</p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              { label: 'Restart this puzzle', onClick: onRestart },
              { label: 'New puzzle', onClick: () => startRandom(saved.size) },
              ...(settings.allowReveal && !solved
                ? [
                    {
                      label: 'Show solution',
                      onClick: () => setRevealing(true),
                    },
                  ]
                : []),
              {
                label: 'Settings',
                onClick: () => navigate([GAME_ROUTE.TWO_TONE, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <GameStatusBar
        elapsedMs={elapsedMs()}
        progressPercent={progressPercent(game)}
        showTimer={settings.showTimer}
        showProgress={settings.showProgress}
      />
      <TwoToneBoard
        size={game.puzzle.givens.size}
        tiles={game.grid.tiles}
        givens={game.puzzle.givens.tiles}
        showGivens={showGivens}
        broken={settings.markBrokenRules ? gameBrokenCells(game) : new Set()}
        hintLine={hintLine}
        hintTargets={hintTargets(hint)}
        hintTwin={hintTwin({ game, hint })}
        onTile={onTile}
      />
      {settings.inputMode === INPUT_MODE.PICK_COLOUR && (
        <TwoToneColourPicker colour={colour} onColour={setColour} />
      )}
      {hint && (
        <p className="text-center" role="status">
          {hintMessage(hint)}
        </p>
      )}
      <RevealDialog
        open={revealing}
        onClose={() => setRevealing(false)}
        onReveal={onReveal}
      />
      <WinDialog
        open={result !== null}
        title="Solved!"
        accent={MENU_ACCENT.TWO_TONE}
        route={GAME_ROUTE.TWO_TONE}
        newLabel={`${saved.size}×${saved.size}`}
        onNew={() => startRandom(saved.size)}
        newBest={result?.newBest ?? false}
        stats={[
          { label: 'Time', value: formatDuration(elapsedMs()) },
          ...(hints > 0 ? [{ label: 'Hints', value: hints }] : []),
        ]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => navigate([GAME_ROUTE.TWO_TONE])}>Home</Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.TWO_TONE} />
    </main>
  )
}
