import { formatDuration } from '@/common/format.functions'
import { CircleHelp, Lightbulb, Undo2, CircleDot } from 'lucide-react'
import { useState } from 'react'

import { useGameTimer } from '@/common/gameTimer.hooks'
import { solvePuzzle, updatePuzzle } from '@/common/puzzleSaves.functions'
import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { HINT_KIND, TILE } from '@/common/twoTone/twoTone.constants'
import {
  encodeChanges,
  gameBrokenCells,
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
} from '@/common/twoTone/twoTone.functions'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import type { Tile, TwoToneGame } from '@/common/twoTone/twoTone.types'
import { decodePuzzle } from '@/common/twoTone/twoToneGenerator.functions'
import { decodeChanges } from '@/common/twoTone/twoTone.functions'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
  TITLE,
} from '@/common/twoTone/twoToneSettings.constants'
import type { TwoToneSettings } from '@/common/twoTone/twoToneSettings.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { GameStatusBar } from '@/components/GameStatusBar/GameStatusBar'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { TwoToneBoard } from '@/components/TwoToneBoard/TwoToneBoard'
import { TwoToneColourPicker } from '@/components/TwoToneColourPicker/TwoToneColourPicker'

export function TwoToneGameView({ id }: { id: number }) {
  const { games, setGames, startRandom } = useTwoToneGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<TwoToneSettings>({
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
  const [rulesOpen, setRulesOpen] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })

  if (!saved || !game) {
    return (
      <main className="mx-auto max-w-md px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.TWO_TONE]} />
        <p>This puzzle could not be found.</p>
      </main>
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
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-3 px-4 pb-6 lg:max-w-4xl">
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
            aria-label="Show the starting tiles"
            aria-pressed={showGivens}
            className={showGivens ? 'bg-muted' : undefined}
            onClick={() => setShowGivens(!showGivens)}
          >
            <CircleDot className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Show a hint"
            disabled={solved}
            onClick={onHint}
          >
            <Lightbulb className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Show the rules"
            onClick={() => setRulesOpen(true)}
          >
            <CircleHelp className="size-5" />
          </Button>
          <MoreMenu
            items={[
              { label: 'Restart this puzzle', onClick: onRestart },
              { label: 'New puzzle', onClick: () => startRandom(saved.size) },
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
      <AppDialog
        open={rulesOpen}
        title="Rules"
        onClose={() => setRulesOpen(false)}
        actions={<Button onClick={() => setRulesOpen(false)}>Got it</Button>}
      >
        <p>
          Fill every tile red or blue. Tap a tile to cycle it: red, blue, empty.
        </p>
        <p>
          No three tiles of the same colour next to each other in a row or
          column.
        </p>
        <p>Every row and column has as many red tiles as blue.</p>
        <p>No two rows are the same, and no two columns are the same.</p>
      </AppDialog>
      <AppDialog
        open={result !== null}
        title="Solved!"
        onClose={() => setResult(null)}
        actions={
          <>
            <Button onClick={() => navigate([GAME_ROUTE.TWO_TONE])}>
              Home
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => startRandom(saved.size)}
            >
              New puzzle
            </Button>
          </>
        }
      >
        {result?.newBest && <p className="font-bold text-primary">New best!</p>}
        <p>Time {formatDuration(elapsedMs())}</p>
        {hints > 0 && <p>Hints {hints}</p>}
      </AppDialog>
    </main>
  )
}
