import { describe, expect, it } from 'vitest'

import { LEVEL } from '@/common/slideOut/slideOut.constants'
import {
  dailyIndex,
  randomIndex,
} from '@/common/slideOut/slideOutBank.functions'

describe('dailyIndex', () => {
  it.each([
    [LEVEL.BEGINNER, 150, 82, 91],
    [LEVEL.EASY, 150, 65, 66],
    [LEVEL.MEDIUM, 150, 117, 97],
    [LEVEL.HARD, 100, 8, 9],
    [LEVEL.EXPERT, 60, 8, 23],
  ])(
    'picks fixed %s puzzles on the first two days',
    (level, count, first, second) => {
      expect([
        dailyIndex({ count, level, date: '2026-10-25' }),
        dailyIndex({ count, level, date: '2026-10-26' }),
      ]).toEqual([first, second])
    },
  )
})

describe('randomIndex', () => {
  it('stays inside the bank', () => {
    expect(randomIndex({ count: 60, seed: 5n })).toBeLessThan(60)
  })
})
