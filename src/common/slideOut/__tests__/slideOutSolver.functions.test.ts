import { describe, expect, it } from 'vitest'

import beginner from '@/assets/slideout/beginner.txt?raw'
import easy from '@/assets/slideout/easy.txt?raw'
import expert from '@/assets/slideout/expert.txt?raw'
import hard from '@/assets/slideout/hard.txt?raw'
import medium from '@/assets/slideout/medium.txt?raw'
import { bankLines } from '@/common/slideOut/slideOutBank.functions'
import { decodePuzzle } from '@/common/slideOut/slideOutBoard.functions'
import { shortestPath } from '@/common/slideOut/slideOutSolver.functions'

describe('shortestPath', () => {
  it.each([
    ['beginner', beginner, 4, { block: 5, position: 4 }],
    ['easy', easy, 10, { block: 4, position: 4 }],
    ['medium', medium, 17, { block: 1, position: 0 }],
    ['hard', hard, 25, { block: 2, position: 0 }],
    ['expert', expert, 34, { block: 11, position: 3 }],
  ])(
    'solves the first %s puzzle in par with a fixed first move',
    (_, text, par, first) => {
      const puzzle = decodePuzzle(bankLines(text)[0])

      const path = shortestPath(puzzle.blocks)

      expect([puzzle.par, path?.length, path?.[0], path?.at(-1)]).toEqual([
        par,
        par,
        first,
        { block: 0, position: 4 },
      ])
    },
  )

  it('needs no moves when the red block is already out', () => {
    expect(shortestPath(decodePuzzle('0;242H').blocks)).toEqual([])
  })
})
