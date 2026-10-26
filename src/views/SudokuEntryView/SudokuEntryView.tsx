import { Check, Eraser, Grid2x2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import {
  ENTRY_PROBLEM_MESSAGE,
  GAME_MODE,
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/common/sudoku/sudoku.constants'
import { conflicts, newGame } from '@/common/sudoku/sudoku.functions'
import { useSudokuGames } from '@/common/sudoku/sudoku.hooks'
import type { Cage, EntryProblem, GameMode } from '@/common/sudoku/sudoku.types'
import { cageProblem, checkPuzzle } from '@/common/sudoku/sudokuEntry.functions'
import {
  createPuzzle,
  encodePuzzle,
} from '@/common/sudoku/sudokuPuzzle.functions'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'
import { NumberPad } from '@/components/NumberPad/NumberPad'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { ENTRY_DIGITS } from '@/views/SudokuEntryView/SudokuEntryView.constants'
import { SudokuBoard } from '@/components/SudokuBoard/SudokuBoard'

export function SudokuEntryView() {
  const { startAndOpen } = useSudokuGames()
  const [mode, setMode] = useState<GameMode>(GAME_MODE.CLASSIC)
  const [givens, setGivens] = useState<number[]>(() => Array(81).fill(0))
  const [cages, setCages] = useState<Cage[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [cageTool, setCageTool] = useState(false)
  const [cageCells, setCageCells] = useState<number[]>([])
  const [cageSum, setCageSum] = useState('')
  const [cageError, setCageError] = useState<EntryProblem | null>(null)
  const [checkProblem, setCheckProblem] = useState<EntryProblem | null>(null)
  const clashes = conflicts({ values: givens, cages })
  const killer = mode === GAME_MODE.KILLER
  const preview = newGame({
    puzzle: createPuzzle({
      givens,
      cages:
        cageTool && cageCells.length > 0
          ? [...cages, { cells: cageCells, sum: Number(cageSum) || 0 }]
          : cages,
    }),
  })

  function onCell(cell: number) {
    if (cageTool) {
      if (cages.some((cage) => cage.cells.includes(cell))) {
        return
      }
      setCageCells((current) =>
        current.includes(cell)
          ? current.filter((it) => it !== cell)
          : [...current, cell],
      )
      setCageError(null)
      return
    }
    setSelected(cell)
  }

  function onDigit(digit: number) {
    if (cageTool) {
      setCageSum((current) => (current + digit).slice(-2))
      return
    }
    if (selected === null) {
      return
    }
    setGivens((current) =>
      current.map((value, cell) =>
        cell === selected ? (value === digit ? 0 : digit) : value,
      ),
    )
  }

  function confirmCage() {
    const sum = cageSum.length > 0 ? Number(cageSum) : null
    const problem = cageProblem({ cells: cageCells, sum })
    if (problem !== null) {
      setCageError(problem)
      return
    }
    setCages((current) => [...current, { cells: cageCells, sum: sum! }])
    setCageCells([])
    setCageSum('')
  }

  function onErase() {
    if (cageTool) {
      if (selected !== null) {
        setCages((current) =>
          current.filter((cage) => !cage.cells.includes(selected)),
        )
      }
      setCageCells([])
      setCageSum('')
      return
    }
    if (selected !== null) {
      setGivens((current) =>
        current.map((value, cell) => (cell === selected ? 0 : value)),
      )
    }
  }

  function play(solution: number[] | null) {
    const puzzle = createPuzzle({
      givens,
      solution,
      cages: killer ? cages : [],
    })
    startAndOpen({
      puzzleId: `custom_${newSeed()}`,
      mode,
      difficulty: null,
      custom: true,
      puzzle: encodePuzzle(puzzle),
    })
  }

  function check() {
    const result = checkPuzzle({ givens, cages: killer ? cages : [] })
    if (result.problem !== null) {
      setCheckProblem(result.problem)
      return
    }
    play(result.solution)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-3 px-3 pb-6">
      <div className="w-full">
        <ScreenHeader
          title="Enter puzzle"
          subtitle={
            cageTool
              ? `Cage sum: ${cageSum || '–'}`
              : `${givens.filter((value) => value !== 0).length} numbers`
          }
          back={[GAME_ROUTE.SUDOKU]}
        />
      </div>
      <div className="w-full max-w-md">
        <OptionGroup
          label="Mode"
          options={GAME_MODES}
          value={mode}
          labels={GAME_MODE_LABEL}
          onChange={(next) => {
            setMode(next)
            setCageTool(false)
          }}
        />
      </div>
      <SudokuBoard
        game={{
          ...preview,
          values: givens,
          selected: cageTool ? null : selected,
          marked: new Set(cageCells),
          rejected: clashes.size > 0 ? { cell: -1, clashes } : null,
          puzzle: { ...preview.puzzle, givens: Array(81).fill(0) },
        }}
        greyGivenCells={false}
        boldPlacedDigits={false}
        onCell={onCell}
      />
      {clashes.size > 0 && (
        <p className="text-sm text-sd-wrong" role="status">
          Some numbers clash. Fix the red cells.
        </p>
      )}
      {cageError !== null && (
        <p className="text-sm text-sd-wrong" role="status">
          {ENTRY_PROBLEM_MESSAGE[cageError]}
        </p>
      )}
      <NumberPad
        digits={ENTRY_DIGITS}
        activeDigit={null}
        doneDigits={new Set()}
        onDigit={onDigit}
        tools={[
          ...(killer
            ? [
                {
                  label: cageTool
                    ? 'Cages on: tap neighbouring cells, type the sum, then tick'
                    : 'Draw cages',
                  icon: Grid2x2,
                  onClick: () => {
                    setCageTool(!cageTool)
                    setCageCells([])
                    setCageSum('')
                  },
                  on: cageTool,
                },
              ]
            : []),
          ...(cageTool
            ? [
                {
                  label: 'Save this cage',
                  icon: Check,
                  onClick: confirmCage,
                  on: false,
                },
              ]
            : []),
          {
            label: cageTool
              ? 'Delete the selected cage'
              : 'Erase the selected cell',
            icon: Eraser,
            onClick: onErase,
            on: false,
          },
          {
            label: 'Clear the whole grid',
            icon: Trash2,
            onClick: () => {
              setGivens(Array(81).fill(0))
              setCages([])
              setCageCells([])
            },
            on: false,
          },
        ]}
      />
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-12 w-full max-w-md text-base"
        disabled={clashes.size > 0}
        onClick={check}
      >
        Play this puzzle
      </Button>
      <AppDialog
        open={checkProblem !== null}
        title="Can't confirm one answer"
        onClose={() => setCheckProblem(null)}
        actions={
          <>
            <Button onClick={() => setCheckProblem(null)}>Keep editing</Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => {
                setCheckProblem(null)
                play(null)
              }}
            >
              Play anyway
            </Button>
          </>
        }
      >
        <p>
          {checkProblem !== null && ENTRY_PROBLEM_MESSAGE[checkProblem]} You can
          still play it. Wrong numbers can't be shown, but clashes can still be
          blocked.
        </p>
      </AppDialog>
    </main>
  )
}
