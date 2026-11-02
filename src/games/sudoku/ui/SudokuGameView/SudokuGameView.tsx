import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import {
  Eraser,
  Lightbulb,
  Pencil,
  Redo2,
  SquareDashed,
  Undo2,
} from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'

import { HINT_STYLE } from '@/shared/game/assists.constants'
import { formatDuration } from '@/shared/lib/format.functions'
import { useGameTimer } from '@/shared/game/gameTimer.hooks'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { useStoredState } from '@/shared/storage/storage.hooks'
import {
  DIFFICULTY_LABEL,
  INPUT_MODE,
} from '@/games/sudoku/engine/sudoku.constants'
import {
  countsMistakes,
  digitCount,
  erase,
  isComplete,
  isDigitDone,
  mark,
  newGame,
  redo,
  restart,
  placeHint,
  revealSolution,
  tapCell,
  tapDigit,
  toggleNotesMode,
  undo,
} from '@/games/sudoku/engine/sudoku.functions'
import { useSudokuGames } from '@/games/sudoku/engine/sudoku.hooks'
import { parseDailyId } from '@/games/sudoku/engine/sudokuBank.functions'
import type { SudokuGame, SudokuHint } from '@/games/sudoku/engine/sudoku.types'
import { findHint } from '@/games/sudoku/engine/sudokuHint.functions'
import {
  decodeMoves,
  encodeMoves,
} from '@/games/sudoku/engine/sudokuMoves.functions'
import { decodePuzzle } from '@/games/sudoku/engine/sudokuPuzzle.functions'
import {
  DEFAULT_SETTINGS,
  DIGIT_COUNTS,
  SETTINGS_KEY,
  SUDOKU_STATUS,
  TITLE,
} from '@/games/sudoku/engine/sudokuSaves.constants'
import {
  fromStoredSettings,
  sudokuTitle,
} from '@/games/sudoku/engine/sudokuSaves.functions'
import type { SudokuSettings } from '@/games/sudoku/engine/sudokuSaves.types'
import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/shared/ui/Button/Button.constants'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { NumberPad } from '@/shared/game/NumberPad/NumberPad'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { SudokuBoard } from '@/games/sudoku/ui/SudokuBoard/SudokuBoard'

const TUTORIAL = [
  {
    target: '[aria-label="Board"]',
    text: 'Tap a cell to select it. Givens are shaded and cannot change.',
  },
  {
    target: '[aria-label="Number pad"]',
    text: 'Then tap a number to place it. The pencil puts numbers in as notes, the eraser clears a cell.',
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Stuck? The bulb points at a cell you can fill next and says why.',
  },
  {
    target: '[aria-label="More"]',
    text: 'Restart, show the solution and settings live in this menu.',
  },
]

export function SudokuGameView({ id }: { id: string }) {
  const { games, openGame, startLevel, saveProgress, finish } = useSudokuGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<SudokuSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<SudokuGame | null>(() => {
    if (!saved) {
      return null
    }
    const started = newGame({
      puzzle: decodePuzzle(saved.puzzle),
      mistakeCheck: saved.mistakeCheck,
    })
    return {
      ...started,
      values: [...saved.values].map(Number),
      notes: saved.notes,
      mistakes: saved.mistakes,
      undoStack: decodeMoves(saved.moves),
    }
  })
  const [confirming, setConfirming] = useState<'restart' | 'reveal' | null>(
    null,
  )
  const [hint, setHint] = useState<SudokuHint | null>(null)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const finished = saved?.status !== SUDOKU_STATUS.IN_PROGRESS

  function startNew() {
    const { mode, difficulty } = saved!
    const inProgress = games.find(
      (other) =>
        other.status === SUDOKU_STATUS.IN_PROGRESS &&
        other.mode === mode &&
        other.difficulty === difficulty &&
        !other.custom &&
        parseDailyId(other.puzzleId) === null,
    )
    if (inProgress) {
      openGame(inProgress)
      return
    }
    void startLevel({ mode, difficulty: difficulty! })
  }

  const complete = game !== null && isComplete(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !complete && !finished,
  })

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (/^[1-9]$/.test(event.key)) {
      update((state) => tapDigit({ game: state, digit: Number(event.key) }))
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      update(erase)
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!saved || !game) {
    return (
      <GameNotFound
        title={TITLE}
        back={[GAME_ROUTE.SUDOKU]}
        message="This game could not be found."
      />
    )
  }

  const modeSettings = fromStoredSettings(settings)[saved.mode]
  const current: SudokuGame = {
    ...game,
    inputMode: settings.inputMode,
    options: {
      highlightHouses: modeSettings.highlightHouses,
      highlightCage: modeSettings.highlightCage,
      sameNumberStyle: modeSettings.sameNumberStyle,
      notesStyle: modeSettings.notesStyle,
      autoRemoveNotes: modeSettings.autoRemoveNotes,
      highlightLastPlaced: modeSettings.highlightLastPlaced,
    },
  }
  const digitFirst = current.inputMode === INPUT_MODE.DIGIT_FIRST
  const size = current.puzzle.grid.size
  const digits = Array.from({ length: size }, (_, i) => i + 1)

  function persist({
    next,
    status,
  }: {
    next: SudokuGame
    status: 'done' | 'reveal' | null
  }) {
    if (!saved) {
      return
    }
    const patch = {
      values: next.values.join(''),
      notes: next.notes,
      moves: encodeMoves(next.undoStack),
      mistakes: next.mistakes,
      elapsedMs: elapsedMs(),
    }
    if (status === 'done') {
      setResult({
        newBest: finish({
          id: saved.id,
          status: SUDOKU_STATUS.COMPLETED,
          patch,
        }),
      })
      return
    }
    if (status === 'reveal') {
      finish({ id: saved.id, status: SUDOKU_STATUS.REVEALED, patch })
      return
    }
    saveProgress({ id: saved.id, patch })
  }

  function update(change: (state: SudokuGame) => SudokuGame) {
    if (finished || complete) {
      return
    }
    const next = change(current)
    setGame(next)
    setHint(null)
    if (
      next.values !== current.values ||
      next.notes !== current.notes ||
      next.mistakes !== current.mistakes
    ) {
      persist({ next, status: isComplete(next) ? 'done' : null })
    }
  }

  function onHint() {
    const found = findHint(current)
    if (found === null || finished || complete) {
      return
    }
    if (modeSettings.hintStyle === HINT_STYLE.FILL) {
      update((state) => placeHint({ game: state, hint: found }))
      return
    }
    setGame({ ...current, selected: found.cell })
    setHint(found)
  }

  function confirm() {
    if (confirming === 'restart') {
      const next = restart(current)
      setGame(next)
      persist({ next, status: null })
    } else if (confirming === 'reveal') {
      const next = revealSolution(current)
      setGame(next)
      persist({ next, status: 'reveal' })
    }
    setConfirming(null)
  }

  const badges = new Map(
    modeSettings.digitCounts === DIGIT_COUNTS.OFF
      ? []
      : digits.map((digit) => {
          const placed = digitCount({ game: current, digit })
          return [
            digit,
            String(
              modeSettings.digitCounts === DIGIT_COUNTS.COUNT_UP
                ? placed
                : Math.max(size - placed, 0),
            ),
          ]
        }),
  )
  const done = new Set(
    digits.filter((digit) => isDigitDone({ game: current, digit })),
  )

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-3 pb-6">
      <div className="w-full">
        <ScreenHeader
          title={sudokuTitle(saved)}
          subtitle={[
            modeSettings.showTimer ? formatDuration(elapsedMs()) : null,
            modeSettings.showMistakeCount && countsMistakes(current)
              ? `Mistakes: ${current.mistakes}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          back={[GAME_ROUTE.SUDOKU]}
        >
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last move"
            disabled={current.undoStack.length === 0 || complete || finished}
            onClick={() => update(undo)}
          >
            <Undo2 className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Redo the move you undid"
            disabled={current.redoStack.length === 0 || complete || finished}
            onClick={() => update(redo)}
          >
            <Redo2 className="size-5" />
          </Button>
          {modeSettings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a hint"
              disabled={complete || finished}
              onClick={onHint}
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {modeSettings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>
                Fill the grid so every row, column and box has each number once.
              </p>
              <p>
                In killer sudoku the numbers in each dashed cage also add up to
                its total, with no number repeated in a cage.
              </p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              {
                label: 'Restart puzzle',
                onClick: () => setConfirming('restart'),
              },
              ...(current.puzzle.solution !== null && modeSettings.allowReveal
                ? [
                    {
                      label: 'Show solution',
                      onClick: () => setConfirming('reveal'),
                    },
                  ]
                : []),
              {
                label: 'Settings',
                onClick: () => navigate([GAME_ROUTE.SUDOKU, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <SudokuBoard
        game={current}
        greyGivenCells={modeSettings.greyGivenCells}
        boldPlacedDigits={modeSettings.boldPlacedDigits}
        onCell={(cell) => update((state) => tapCell({ game: state, cell }))}
      />
      <p className="h-6 text-sm font-semibold" role="status">
        {hint?.message ?? ''}
      </p>
      <NumberPad
        digits={digits}
        activeDigit={digitFirst ? current.activeDigit : null}
        doneDigits={new Set()}
        disabledDigits={modeSettings.disableCompletedDigits ? done : new Set()}
        badges={badges}
        onDigit={(digit) => update((state) => tapDigit({ game: state, digit }))}
        tools={[
          {
            label: digitFirst
              ? 'Eraser: tap cells to clear them, tap again to stop'
              : 'Erase the selected cell',
            icon: Eraser,
            onClick: () => update(erase),
            on: current.eraserActive,
          },
          {
            label: current.notesMode
              ? 'Notes on: numbers go in as pencil marks'
              : 'Notes off: tap to add pencil marks',
            icon: Pencil,
            onClick: () => update(toggleNotesMode),
            on: current.notesMode,
          },
          {
            label: digitFirst
              ? 'Mark: tap cells to box them in red, tap again to stop'
              : 'Box the selected cell in red, to remember where a trial started',
            icon: SquareDashed,
            onClick: () => update(mark),
            on: current.markActive,
          },
        ]}
      />
      <AppDialog
        open={confirming !== null}
        title={
          confirming === 'restart'
            ? 'Restart this puzzle?'
            : 'Show the solution?'
        }
        onClose={() => setConfirming(null)}
        actions={
          <>
            <Button onClick={() => setConfirming(null)}>Cancel</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={confirm}>
              {confirming === 'restart' ? 'Restart' : 'Show solution'}
            </Button>
          </>
        }
      >
        <p>
          {confirming === 'restart'
            ? 'Your numbers, pencil marks, mistakes and time will be cleared.'
            : "This ends the game. It won't count towards best times or medals."}
        </p>
      </AppDialog>
      <WinDialog
        open={result !== null}
        title="Solved!"
        accent={MENU_ACCENT.SUDOKU}
        route={GAME_ROUTE.SUDOKU}
        mode={saved.mode}
        newLabel={
          saved.difficulty === null || saved.custom
            ? undefined
            : DIFFICULTY_LABEL[saved.difficulty]
        }
        onNew={saved.difficulty === null || saved.custom ? undefined : startNew}
        newBest={result?.newBest ?? false}
        stats={[
          { label: 'Time', value: formatDuration(elapsedMs()) },
          { label: 'Mistakes', value: current.mistakes },
        ]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => navigate([GAME_ROUTE.SUDOKU])}>Home</Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.SUDOKU} />
    </main>
  )
}
