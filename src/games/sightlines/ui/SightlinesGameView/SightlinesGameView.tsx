import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { RevealDialog } from '@/shared/game/RevealDialog/RevealDialog'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { formatDuration } from '@/shared/lib/format.functions'
import { ArrowLeftRight, Lightbulb, Undo2 } from 'lucide-react'
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
import { DOT, HINT_KIND } from '@/games/sightlines/engine/sightlines.constants'
import {
  encodeChanges,
  hintMessage,
  hintTargets,
  isSolved,
  newGame,
  paint,
  progressPercent,
  replay,
  tap,
  undo,
  withHint,
} from '@/games/sightlines/engine/sightlines.functions'
import { useSightlinesGames } from '@/games/sightlines/engine/sightlines.hooks'
import type {
  Dot,
  SightlinesGame,
} from '@/games/sightlines/engine/sightlines.types'
import { seenAll } from '@/games/sightlines/engine/sightlinesGrid.functions'
import {
  brokenCells,
  decodePuzzle,
} from '@/games/sightlines/engine/sightlinesPuzzle.functions'
import { decodeChanges } from '@/games/sightlines/engine/sightlines.functions'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
  TITLE,
} from '@/games/sightlines/engine/sightlinesSaves.constants'
import type { SightlinesSettings } from '@/games/sightlines/engine/sightlinesSaves.types'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { GameStatusBar } from '@/shared/game/GameStatusBar/GameStatusBar'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { SightlinesBoard } from '@/games/sightlines/ui/SightlinesBoard/SightlinesBoard'
import { SightlinesColourPicker } from '@/games/sightlines/ui/SightlinesColourPicker/SightlinesColourPicker'

const TUTORIAL = [
  {
    target: '[aria-label="Board"]',
    text: 'Tap a dot to cycle it blue, red, empty. A number says how many blue dots it can see along its row and column; red dots block the view.',
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

export function SightlinesGameView({ id }: { id: string }) {
  const { games, setGames, startRandom } = useSightlinesGames()
  const saved = games.find((game) => game.id === id)
  const [settings, setSettings] = useStoredState<SightlinesSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<SightlinesGame | null>(() =>
    saved
      ? replay({
          puzzle: decodePuzzle(saved.puzzle),
          changes: decodeChanges(saved.changes),
        })
      : null,
  )
  const [hints, setHints] = useState(saved?.hints ?? 0)
  const [colour, setColour] = useState<Dot>(DOT.BLUE)
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
        back={[GAME_ROUTE.SIGHTLINES]}
        message="This puzzle could not be found."
      />
    )
  }

  function persist({
    next,
    hintCount,
  }: {
    next: SightlinesGame
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

  function move(change: (current: SightlinesGame) => SightlinesGame) {
    if (!game) {
      return
    }
    const next = change(game)
    setGame(next)
    if (next.changes !== game.changes) {
      persist({ next, hintCount: hints })
    }
  }

  function onDot(cell: number) {
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
        <ScreenHeader title={puzzleTitle(saved)} back={[GAME_ROUTE.SIGHTLINES]}>
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
                Fill every dot blue or red. Tap a dot to cycle it: blue, red,
                empty.
              </p>
              <p>
                Blue dots can see other blue dots in their own row and column.
                Red dots block the view.
              </p>
              <p>A number says how many blue dots that dot can see.</p>
              <p>Every blue dot must see at least one other.</p>
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
                onClick: () =>
                  navigate([GAME_ROUTE.SIGHTLINES, SCREEN.SETTINGS]),
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
      <SightlinesBoard
        size={game.grid.size}
        dots={game.grid.dots}
        numbers={game.puzzle.numbers}
        walls={game.puzzle.walls}
        seen={
          settings.showSeen
            ? new Map(
                [...game.puzzle.numbers.keys()].map((cell) => [
                  cell,
                  seenAll({ grid: game.grid, cell }),
                ]),
              )
            : null
        }
        broken={
          settings.markBrokenRules
            ? brokenCells({ puzzle: game.puzzle, grid: game.grid })
            : new Set()
        }
        hintLine={hintLine}
        hintTargets={hintTargets(hint)}
        onDot={onDot}
      />
      {settings.inputMode === INPUT_MODE.PICK_COLOUR && (
        <SightlinesColourPicker colour={colour} onColour={setColour} />
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
        accent={MENU_ACCENT.SIGHTLINES}
        route={GAME_ROUTE.SIGHTLINES}
        newLabel={`${saved.size}×${saved.size}`}
        onNew={() => startRandom(saved.size)}
        newBest={result?.newBest ?? false}
        stats={[
          { label: 'Time', value: formatDuration(elapsedMs()) },
          ...(hints > 0 ? [{ label: 'Hints', value: hints }] : []),
        ]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => navigate([GAME_ROUTE.SIGHTLINES])}>
            Home
          </Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.SIGHTLINES} />
    </main>
  )
}
