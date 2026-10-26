import { describe, expect, it } from 'vitest'

import { newGame, placeHint } from '@/common/sudoku/sudoku.functions'
import { findHint } from '@/common/sudoku/sudokuHint.functions'
import { decodePuzzle } from '@/common/sudoku/sudokuPuzzle.functions'

const SOLUTION =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179'

const PUZZLE = decodePuzzle(`0${SOLUTION.slice(1, 79)}00|${SOLUTION}|`)

describe('findHint', () => {
  it('points at a cell where only one digit fits', () => {
    expect(findHint(newGame({ puzzle: PUZZLE }))).toEqual({
      cell: 0,
      digit: 5,
      message: 'Only 5 fits here.',
    })
  })

  it('points at a wrong digit first', () => {
    const game = { ...newGame({ puzzle: PUZZLE }), values: [...PUZZLE.givens] }
    game.values[80] = 1

    expect(findHint(game)).toEqual({
      cell: 80,
      digit: 9,
      message: 'This cell is wrong.',
    })
  })

  it('places the hinted digit', () => {
    const game = newGame({ puzzle: PUZZLE })

    const placed = placeHint({ game, hint: findHint(game)! })

    expect(placed.values[0]).toBe(5)
  })
})
