import { describe, expect, it } from 'vitest'

import eight from '@data/kakuro/8.txt?raw'

import {
  newGame,
  placeHint,
  revealSolution,
} from '@/common/kakuro/kakuro.functions'
import { findHint } from '@/common/kakuro/kakuroHint.functions'
import {
  createPuzzle,
  decodePuzzle,
} from '@/common/kakuro/kakuroPuzzle.functions'

const SMALL = createPuzzle({ size: 3, solution: [0, 0, 0, 0, 1, 2, 0, 3, 4] })

describe('findHint', () => {
  it('points at a cell where only one digit fits', () => {
    const hint = findHint(newGame({ puzzle: SMALL }))

    expect(hint).toEqual({
      cell: 4,
      digit: 1,
      message:
        'Only 1 fits here: 3 in 2 across and 4 in 2 down leave no other digit.',
    })
  })

  it('points at a wrong digit first', () => {
    const game = {
      ...newGame({ puzzle: SMALL }),
      values: [0, 0, 0, 0, 0, 0, 0, 0, 9],
    }

    expect(findHint(game)?.message).toBe('This cell is wrong.')
  })

  it('works out every step of a bank puzzle by crossing its runs', () => {
    const messages: string[] = []
    let game = newGame({ puzzle: decodePuzzle(eight.split('\n')[0]) })
    for (let hint = findHint(game); hint !== null; hint = findHint(game)) {
      messages.push(hint.message)
      game = placeHint({ game, hint })
    }

    expect(messages.filter((it) => it.startsWith('No cell'))).toEqual([])
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
