import { describe, expect, it } from 'vitest'

import {
  bankLines,
  dailyIndex,
  randomIndex,
} from '@/common/kakuro/kakuroBank.functions'

describe('dailyIndex', () => {
  it.each([
    [6, 200, 38, 189],
    [8, 200, 19, 7],
    [10, 150, 105, 59],
    [12, 60, 13, 30],
  ])(
    'picks fixed %i x %i puzzles on the first two days',
    (size, count, first, second) => {
      expect([
        dailyIndex({ count, size, date: '2026-10-25' }),
        dailyIndex({ count, size, date: '2026-10-26' }),
      ]).toEqual([first, second])
    },
  )
})

describe('randomIndex', () => {
  it('picks a fixed puzzle for a seed', () => {
    expect(randomIndex({ count: 150, seed: 123n })).toBe(56)
  })
})

describe('bankLines', () => {
  it('skips blank lines', () => {
    expect(bankLines('a\n\nb\n')).toEqual(['a', 'b'])
  })
})
