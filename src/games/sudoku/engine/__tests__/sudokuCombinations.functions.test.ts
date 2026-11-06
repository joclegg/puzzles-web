import { describe, expect, it } from 'vitest'

import {
  cageCombinations,
  newGame,
} from '@/games/sudoku/engine/sudoku.functions'
import type { Cage } from '@/games/sudoku/engine/sudoku.types'
import { createPuzzle } from '@/games/sudoku/engine/sudokuPuzzle.functions'
import { COMBINATION_ORDER } from '@/shared/game/combinations.constants'

function digits(line: ReturnType<typeof cageCombinations>) {
  return line?.options.map((option) => option.map((it) => it.digit).join(' '))
}

function killer({ cells, cage }: { cells: number; cage: Cage }) {
  return newGame({
    puzzle: createPuzzle({
      givens: Array.from({ length: cells }, () => 0),
      cages: [cage],
    }),
  })
}

describe('cageCombinations', () => {
  it.each([
    [2, 10, ['1 9', '2 8', '3 7', '4 6']],
    [2, 17, ['8 9']],
    [3, 6, ['1 2 3']],
  ])(
    'lists every set of different digits for %i cells adding to %i',
    (length, sum, expected) => {
      const game = {
        ...killer({
          cells: 81,
          cage: { cells: Array.from({ length }, (_, i) => i), sum },
        }),
        selected: 0,
      }

      const line = cageCombinations({
        game,
        order: COMBINATION_ORDER.INCREASING,
      })

      expect([line?.label, digits(line)]).toEqual([
        `Cage ${sum} in ${length}`,
        expected,
      ])
    },
  )

  it('keeps only combinations holding the digits already placed', () => {
    const empty = killer({ cells: 81, cage: { cells: [0, 1], sum: 10 } })
    const game = {
      ...empty,
      values: empty.values.map((value, cell) => (cell === 0 ? 3 : value)),
      selected: 1,
    }

    const line = cageCombinations({
      game,
      order: COMBINATION_ORDER.INCREASING,
    })

    expect(line?.options).toEqual([
      [
        { digit: 3, placed: true },
        { digit: 7, placed: false },
      ],
    ])
  })

  it('leaves out digits above six on a six by six grid', () => {
    const game = {
      ...killer({ cells: 36, cage: { cells: [0, 1], sum: 11 } }),
      selected: 0,
    }

    const line = cageCombinations({
      game,
      order: COMBINATION_ORDER.INCREASING,
    })

    expect(digits(line)).toEqual(['5 6'])
  })

  it('gives nothing for a cell outside every cage', () => {
    const game = {
      ...killer({ cells: 81, cage: { cells: [0, 1], sum: 10 } }),
      selected: 5,
    }

    expect(
      cageCombinations({ game, order: COMBINATION_ORDER.INCREASING }),
    ).toBeNull()
  })
})
