import { describe, expect, it } from 'vitest'

import beginner from '@data/slideout/beginner.txt?raw'
import easy from '@data/slideout/easy.txt?raw'
import expert from '@data/slideout/expert.txt?raw'
import hard from '@data/slideout/hard.txt?raw'
import medium from '@data/slideout/medium.txt?raw'
import { bankLines } from '@/common/slideOut/slideOutBank.functions'
import { decodePuzzle } from '@/common/slideOut/slideOutBoard.functions'
import { shortestPath } from '@/common/slideOut/slideOutSolver.functions'

describe('shortestPath', () => {
  it.each([
    ['beginner', beginner],
    ['easy', easy],
    ['medium', medium],
    ['hard', hard],
    ['expert', expert],
  ])('solves the first %s puzzle in exactly par moves', (_, text) => {
    const puzzle = decodePuzzle(bankLines(text)[0])

    const path = shortestPath(puzzle.blocks)

    expect([path?.length, path?.at(-1)]).toEqual([
      puzzle.par,
      { block: 0, position: 4 },
    ])
  })

  it('needs no moves when the red block is already out', () => {
    expect(shortestPath(decodePuzzle('0;242H').blocks)).toEqual([])
  })
})
