import { describe, expect, it } from 'vitest'

import {
  createPuzzle,
  decodePuzzle,
  digitsOf,
  encodePuzzle,
  masksFor,
} from '@/common/kakuro/kakuroPuzzle.functions'

describe('createPuzzle', () => {
  it('finds the across and down runs with their clues', () => {
    const puzzle = createPuzzle({
      size: 3,
      solution: [0, 0, 0, 0, 1, 2, 0, 3, 4],
    })

    expect(puzzle.runs).toEqual([
      { cells: [4, 5], sum: 3, isAcross: true, clueCell: 3 },
      { cells: [7, 8], sum: 7, isAcross: true, clueCell: 6 },
      { cells: [4, 7], sum: 4, isAcross: false, clueCell: 1 },
      { cells: [5, 8], sum: 6, isAcross: false, clueCell: 2 },
    ])
  })
})

describe('masksFor', () => {
  it('lists the digit sets of a run', () => {
    expect(masksFor({ length: 2, sum: 4 }).map(digitsOf)).toEqual([[1, 3]])
  })
})

describe('encodePuzzle', () => {
  it('round-trips a bank line', () => {
    const line = '6;000000012300045600078900000000000000;9,14'

    expect(encodePuzzle(decodePuzzle(line))).toBe(line)
  })
})
