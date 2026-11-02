import { describe, expect, it } from 'vitest'

import { STANDARD_GRID } from '@/games/sudoku/engine/sudoku.constants'
import { createPuzzle } from '@/games/sudoku/engine/sudokuPuzzle.functions'
import {
  boxEdges,
  cageSides,
  cageSumCells,
} from '@/games/sudoku/ui/SudokuBoard/SudokuBoard.functions'

const PUZZLE = createPuzzle({
  givens: Array(81).fill(0),
  cages: [
    { cells: [0, 1, 9], sum: 10 },
    { cells: [2], sum: 4 },
  ],
})

describe('boxEdges', () => {
  it('draws a thick line after every third column and row', () => {
    expect(boxEdges({ grid: STANDARD_GRID, cell: 20 })).toEqual({
      thickRight: true,
      thickBottom: true,
      lastCol: false,
      lastRow: false,
    })
  })
})

describe('cageSides', () => {
  it('outlines only the sides that leave the cage', () => {
    expect(cageSides({ puzzle: PUZZLE, cell: 0 })).toEqual({
      top: true,
      right: false,
      bottom: false,
      left: true,
    })
  })
})

describe('cageSumCells', () => {
  it('puts each sum in the first cell of its cage', () => {
    expect([...cageSumCells(PUZZLE)]).toEqual([
      [0, 0],
      [2, 1],
    ])
  })
})
