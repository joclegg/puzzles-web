import { describe, expect, it } from 'vitest'

import {
  HIGHLIGHT,
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/sudoku/sudoku.constants'
import {
  conflicts,
  erase,
  highlightOf,
  isComplete,
  isWrong,
  mark,
  newGame,
  redo,
  revealSolution,
  tapCell,
  tapDigit,
  toggleNotesMode,
  undo,
} from '@/common/sudoku/sudoku.functions'
import type { SudokuGame } from '@/common/sudoku/sudoku.types'
import { decodeMoves, encodeMoves } from '@/common/sudoku/sudokuMoves.functions'
import { decodePuzzle } from '@/common/sudoku/sudokuPuzzle.functions'

const SOLUTION =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179'

const GIVENS = `0${SOLUTION.slice(1, 79)}00`

const PUZZLE = decodePuzzle(`${GIVENS}|${SOLUTION}|`)

function enter({
  game,
  cell,
  digit,
}: {
  game: SudokuGame
  cell: number
  digit: number
}) {
  return tapDigit({ game: tapCell({ game, cell }), digit })
}

describe('entering digits', () => {
  it('places a digit and clears it with a second tap', () => {
    const placed = enter({
      game: newGame({ puzzle: PUZZLE }),
      cell: 0,
      digit: 5,
    })

    expect([
      placed.values[0],
      tapDigit({ game: placed, digit: 5 }).values[0],
    ]).toEqual([5, 0])
  })

  it('counts and shows a wrong digit', () => {
    const after = enter({
      game: newGame({ puzzle: PUZZLE }),
      cell: 0,
      digit: 4,
    })

    expect([after.mistakes, isWrong({ game: after, cell: 0 })]).toEqual([
      1,
      true,
    ])
  })

  it('refuses a clashing digit when clashes are blocked', () => {
    const game = newGame({
      puzzle: PUZZLE,
      mistakeCheck: MISTAKE_CHECK.BLOCK_CLASHES,
    })

    const after = enter({ game, cell: 0, digit: 3 })

    expect([after.values[0], after.rejected?.cell, after.mistakes]).toEqual([
      0, 0, 1,
    ])
  })

  it('leaves a given alone', () => {
    expect(
      enter({ game: newGame({ puzzle: PUZZLE }), cell: 1, digit: 9 }).values[1],
    ).toBe(3)
  })

  it('completes the puzzle with the last digits', () => {
    const after = [
      [0, 5],
      [79, 7],
      [80, 9],
    ].reduce(
      (game, [cell, digit]) => enter({ game, cell, digit }),
      newGame({ puzzle: PUZZLE }),
    )

    expect(isComplete(after)).toBe(true)
  })
})

describe('notes', () => {
  it('toggles notes and clears matching notes from peers when a digit goes in', () => {
    const noted = tapDigit({
      game: toggleNotesMode(
        tapCell({ game: newGame({ puzzle: PUZZLE }), cell: 79 }),
      ),
      digit: 9,
    })

    const after = enter({ game: toggleNotesMode(noted), cell: 80, digit: 9 })

    expect([noted.notes[79], after.notes[79]]).toEqual([1 << 9, 0])
  })
})

describe('undo and redo', () => {
  it('takes back and replays a move', () => {
    const played = enter({
      game: newGame({ puzzle: PUZZLE }),
      cell: 0,
      digit: 5,
    })

    const undone = undo(played)

    expect([undone.values[0], redo(undone).values[0]]).toEqual([0, 5])
  })

  it('round-trips moves through their encoding', () => {
    const played = enter({
      game: newGame({ puzzle: PUZZLE }),
      cell: 0,
      digit: 4,
    })

    expect(decodeMoves(encodeMoves(played.undoStack))).toEqual(played.undoStack)
  })
})

describe('number first', () => {
  it('fills tapped cells with the picked digit, and erase clears them', () => {
    const game = tapDigit({
      game: newGame({ puzzle: PUZZLE, inputMode: INPUT_MODE.DIGIT_FIRST }),
      digit: 7,
    })

    const placed = tapCell({ game, cell: 79 })
    const erased = tapCell({ game: erase(placed), cell: 79 })

    expect([placed.values[79], erased.values[79]]).toEqual([7, 0])
  })

  it('boxes tapped cells in mark mode', () => {
    const game = mark(
      newGame({ puzzle: PUZZLE, inputMode: INPUT_MODE.DIGIT_FIRST }),
    )

    expect(tapCell({ game, cell: 4 }).marked.has(4)).toBe(true)
  })
})

describe('highlightOf', () => {
  it('highlights the selected cell, its peers and the same digit', () => {
    const game = tapCell({ game: newGame({ puzzle: PUZZLE }), cell: 1 })

    expect([
      highlightOf({ game, cell: 1 }),
      highlightOf({ game, cell: 2 }),
      highlightOf({ game, cell: 15 }),
      highlightOf({ game, cell: 60 }),
    ]).toEqual([
      HIGHLIGHT.SELECTED,
      HIGHLIGHT.PEER,
      HIGHLIGHT.SAME_DIGIT,
      HIGHLIGHT.NONE,
    ])
  })
})

describe('revealSolution', () => {
  it('fills in every digit', () => {
    expect(revealSolution(newGame({ puzzle: PUZZLE })).values.join('')).toBe(
      SOLUTION,
    )
  })
})

describe('conflicts', () => {
  it('lists repeated digits in a house', () => {
    const values = [...PUZZLE.givens]
    values[0] = 3

    expect(conflicts({ values }).has(0)).toBe(true)
  })
})
