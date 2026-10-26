import { describe, expect, it } from 'vitest'

import { epochDay } from '@/common/date.functions'
import {
  DAILY_SEED_SPREAD,
  SIZES,
} from '@/common/sightlines/sightlines.constants'
import { generatePuzzle } from '@/common/sightlines/sightlinesGenerator.functions'
import { seenAll } from '@/common/sightlines/sightlinesGrid.functions'
import {
  decodePuzzle,
  encodePuzzle,
  givensOf,
} from '@/common/sightlines/sightlinesPuzzle.functions'
import { solveLogically } from '@/common/sightlines/sightlinesSolver.functions'

const EXPECTED: Record<number, string> = {
  4: '4;.2..12.....X.XX.;RBBRBBRRRRRRRRRR',
  5: '5;4..4X....1.2.......2X.XXX;BBBBRBBRBBRBRRRRRBBBRRRRR',
  6: '6;.1....2..1...23........6....3.434.X4;BBRRRRBRBBRBBBBRBBRRRBBBBRBRBBBBBBRB',
  7: '7;..6..35.3...4......3.........X.3....X1..1.4..25..;BBBBRBBRBBRBBBBBBBRBBBRBBBRBBRRBBRBBRBRBBRBRBBBRR',
  8: '8;3..3X.X..2X5.3......3.XX...........3...X2.85.6...X....5..3....41;BRBBRRRRBBRBBBBRBBRBBRRRBRBRBRRRRBBBRBBRBRBBBBBRBRBRBBBRBBBBRRBB',
  9: '9;X.......7...5.4..1X.5....X.X...53....5X..X5....7.....2...5...3...65....1..5..6...;RRBBBBBBBRRBBBBRRBRBBBRRRRRRRBRBBBBRBBRRBRBRRBBBBBRBBBBBBBRBBBRBBBBRBBRBBBBRBBBBB',
}

describe('generatePuzzle', { timeout: 10_000 }, () => {
  it.each(SIZES)(
    'makes a %i grid whose numbers are right and logic solves',
    (size) => {
      const puzzle = generatePuzzle({ size, seed: BigInt(size) })

      for (const [cell, number] of puzzle.numbers) {
        expect(number).toBe(seenAll({ grid: puzzle.solution, cell }))
        expect(number).toBeLessThanOrEqual(size)
      }
      expect(
        solveLogically({ start: givensOf(puzzle), numbers: puzzle.numbers }),
      ).toEqual(puzzle.solution)
    },
  )

  it.each(SIZES)('makes the fixed %i grid for its seed', (size) => {
    expect(encodePuzzle(generatePuzzle({ size, seed: BigInt(size) }))).toBe(
      EXPECTED[size],
    )
  })

  it.each([
    [4, '4;..X...X.44.24..X;BBRBBBRBBBRBBBRR'],
    [
      6,
      '6;.4......4.43..2...11.2.X..X..X.X....;BBBBRBBBBRBBRRBRBBBBRBBRRRRBBRRRRRRR',
    ],
  ])('makes the fixed daily %i puzzle for a date', (size, expected) => {
    const seed =
      BigInt(epochDay('2026-10-25')) * DAILY_SEED_SPREAD + BigInt(size)

    expect(encodePuzzle(generatePuzzle({ size, seed }))).toBe(expected)
  })

  it.each([1n, 2n, 3n])('round-trips seed %i through its encoding', (seed) => {
    const puzzle = generatePuzzle({ size: 6, seed })

    expect(encodePuzzle(decodePuzzle(encodePuzzle(puzzle)))).toBe(
      encodePuzzle(puzzle),
    )
  })
})
