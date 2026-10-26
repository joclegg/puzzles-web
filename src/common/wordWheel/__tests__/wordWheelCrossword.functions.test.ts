import { describe, expect, it } from 'vitest'

import {
  crosswordSize,
  decodePuzzle,
  letterAt,
} from '@/common/wordWheel/wordWheelCrossword.functions'

const PUZZLE = decodePuzzle(
  'TOHBR;BROTH@1,2,A|BOTH@1,2,D|ROB@0,4,D|ROT@3,0,A|HOT@1,6,D',
)

describe('crosswordSize', () => {
  it('spans every placed letter', () => {
    expect(crosswordSize(PUZZLE)).toEqual({ rows: 5, cols: 7 })
  })
})

describe('letterAt', () => {
  it('maps crossing cells to one letter', () => {
    const letters = letterAt(PUZZLE)

    expect([
      letters.get('1,2'),
      letters.get('1,4'),
      letters.get('3,2'),
    ]).toEqual(['B', 'O', 'T'])
  })
})
