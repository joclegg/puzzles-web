import {
  CircleHelp,
  Eraser,
  Pencil,
  Redo2,
  SquareDashed,
  Undo2,
} from 'lucide-react'
import { useState } from 'react'

import { formatDuration } from '@/common/format.functions'
import { useGameTimer } from '@/common/gameTimer.hooks'
import { DIGITS, INPUT_MODE } from '@/common/kakuro/kakuro.constants'
import {
  combinationLines,
  decodeChanges,
  encodeChanges,
  erase,
  isDigitDone,
  isSolved,
  mark,
  newGame,
  redo,
  replay,
  restart,
  runCellsOf,
  shownWrongCells,
  tapCell,
  tapDigit,
  toggleNotes,
  undo,
} from '@/common/kakuro/kakuro.functions'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import type { KakuroGame } from '@/common/kakuro/kakuro.types'
import { decodePuzzle } from '@/common/kakuro/kakuroPuzzle.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/common/kakuro/kakuroSettings.constants'
import type { KakuroSettings } from '@/common/kakuro/kakuroSettings.types'
import { MISTAKE_CHECK } from '@/common/kakuro/kakuro.constants'
import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { KakuroBoard } from '@/components/KakuroBoard/KakuroBoard'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { NumberPad } from '@/components/NumberPad/NumberPad'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function KakuroGameView({ id }: { id: number }) {
  const { games, startRandom, saveProgress, finish } = useKakuroGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<KakuroSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<KakuroGame | null>(() =>
    saved
      ? {
          ...replay({
            game: newGame({ puzzle: decodePuzzle(saved.puzzle) }),
            changes: decodeChanges(saved.changes),
          }),
          mistakes: saved.mistakes ?? 0,
        }
      : null,
  )
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
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.KAKURO]} />
        <p>This puzzle could not be found.</p>
      </main>
    )
  }

  const current: KakuroGame = {
    ...game,
    inputMode: settings.inputMode,
    mistakeCheck: settings.mistakeCheck,
    autoRemoveNotes: settings.autoRemoveNotes,
  }
  const digitFirst = current.inputMode === INPUT_MODE.DIGIT_FIRST

  function move(change: (state: KakuroGame) => KakuroGame) {
    if (!saved) {
      return
    }
    const next = change(current)
    setGame(next)
    if (
      next.changes === current.changes &&
      next.mistakes === current.mistakes
    ) {
      return
    }
    const changes = encodeChanges(next.changes)
    if (isSolved(next)) {
      const newBest = finish({
        id: saved.id,
        elapsedMs: elapsedMs(),
        changes,
        mistakes: next.mistakes,
      })
      setResult({ newBest })
      return
    }
    saveProgress({
      id: saved.id,
      patch: { changes, mistakes: next.mistakes, elapsedMs: elapsedMs() },
    })
  }

  const wrong = shownWrongCells(current)
  if (current.rejected !== null) {
    wrong.add(current.rejected)
  }
  const sameDigit = new Set(
    current.activeDigit === null
      ? []
      : current.values.flatMap((value, cell) =>
          value === current.activeDigit ? [cell] : [],
        ),
  )

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-3 px-3 pb-6">
      <div className="w-full">
        <ScreenHeader
          title={puzzleTitle(saved)}
          subtitle={[
            settings.showTimer ? formatDuration(elapsedMs()) : null,
            settings.showMistakeCount &&
            current.mistakeCheck !== MISTAKE_CHECK.OFF
              ? `Mistakes ${current.mistakes}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          back={[GAME_ROUTE.KAKURO]}
        >
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last tap"
            disabled={current.changes.length === 0 || solved}
            onClick={() => move(undo)}
          >
            <Undo2 className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Redo the tap you undid"
            disabled={current.undone.length === 0 || solved}
            onClick={() => move(redo)}
          >
            <Redo2 className="size-5" />
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
              {
                label: 'Restart this puzzle',
                onClick: () => !solved && move(restart),
              },
              { label: 'New puzzle', onClick: () => startRandom(saved.size) },
              {
                label: 'Settings',
                onClick: () => navigate([GAME_ROUTE.KAKURO, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <KakuroBoard
        puzzle={current.puzzle}
        values={current.values}
        notes={current.notes}
        selected={current.selected}
        runCells={settings.highlightRuns ? runCellsOf(current) : new Set()}
        wrong={wrong}
        sameDigit={sameDigit}
        marked={current.marked}
        onCell={(cell) => move((state) => tapCell({ game: state, cell }))}
      />
      {settings.showCombinations && (
        <ul
          className="w-full max-w-md text-sm text-muted-foreground"
          aria-label="Combinations"
        >
          {combinationLines(current).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <NumberPad
        digits={DIGITS}
        activeDigit={digitFirst ? current.activeDigit : null}
        doneDigits={
          new Set(
            DIGITS.filter((digit) => isDigitDone({ game: current, digit })),
          )
        }
        onDigit={(digit) => move((state) => tapDigit({ game: state, digit }))}
        tools={[
          {
            label: !digitFirst
              ? 'Clear the selected cell'
              : current.eraserActive
                ? 'Erase is on: tap cells to clear them'
                : 'Turn on erase, then tap cells to clear them',
            icon: Eraser,
            onClick: () => move(erase),
            on: current.eraserActive,
          },
          {
            label: current.notesMode
              ? 'Notes are on: digits go in as notes'
              : 'Notes are off: digits go in as answers',
            icon: Pencil,
            onClick: () => move(toggleNotes),
            on: current.notesMode,
          },
          {
            label: digitFirst
              ? 'Mark: tap cells to box them in red, tap again to stop'
              : 'Box the selected cell in red, to remember where a trial started',
            icon: SquareDashed,
            onClick: () => move(mark),
            on: current.markActive,
          },
        ]}
      />
      <AppDialog
        open={rulesOpen}
        title="Rules"
        onClose={() => setRulesOpen(false)}
        actions={<Button onClick={() => setRulesOpen(false)}>Got it</Button>}
      >
        <p>Fill each white cell with a digit from 1 to 9.</p>
        <p>
          The number above a diagonal is the sum of the run to its right; below
          it, the run beneath.
        </p>
        <p>A digit can't repeat within a run.</p>
      </AppDialog>
      <AppDialog
        open={result !== null}
        title="Solved!"
        onClose={() => setResult(null)}
        actions={
          <>
            <Button onClick={() => navigate([GAME_ROUTE.KAKURO])}>Home</Button>
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
      </AppDialog>
    </main>
  )
}
