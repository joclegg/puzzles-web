import { describe, expect, it } from 'vitest'

import {
  newGame,
  placeHint,
  revealSolution,
} from '@/common/kakuro/kakuro.functions'
import { findHint } from '@/common/kakuro/kakuroHint.functions'
import { createPuzzle } from '@/common/kakuro/kakuroPuzzle.functions'

const SMALL = createPuzzle({ size: 3, solution: [0, 0, 0, 0, 1, 2, 0, 3, 4] })

describe('findHint', () => {
  it('points at a cell where only one digit fits', () => {
    const hint = findHint(newGame({ puzzle: SMALL }))

    expect(hint).toEqual({ cell: 4, digit: 1, message: 'Only 1 fits here.' })
  })

  it('points at a wrong digit first', () => {
    const game = {
      ...newGame({ puzzle: SMALL }),
      values: [0, 0, 0, 0, 0, 0, 0, 0, 9],
    }

    expect(findHint(game)?.message).toBe('This cell is wrong.')
  })

  it('places the hinted digit', () => {
    const game = newGame({ puzzle: SMALL })

    expect(placeHint({ game, hint: findHint(game)! }).values[4]).toBe(1)
  })
})

describe('revealSolution', () => {
  it('fills every cell with the answer', () => {
    expect(revealSolution(newGame({ puzzle: SMALL })).values).toEqual(
      SMALL.solution,
    )
  })
})
