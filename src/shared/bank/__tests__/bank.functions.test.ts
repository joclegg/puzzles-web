import { describe, expect, it } from 'vitest'

import {
  bankLines,
  dailyIndex,
  randomIndex,
} from '@/shared/bank/bank.functions'
import { FIRST_DAY as KAKURO_FIRST_DAY } from '@/games/kakuro/engine/kakuro.constants'
import {
  FIRST_DAY as SLIDE_OUT_FIRST_DAY,
  LEVEL as SLIDE_OUT_LEVEL,
  LEVELS as SLIDE_OUT_LEVELS,
} from '@/games/slideOut/engine/slideOut.constants'
import {
  FIRST_DAY as WORD_WHEEL_FIRST_DAY,
  LEVEL as WORD_WHEEL_LEVEL,
  LEVELS as WORD_WHEEL_LEVELS,
} from '@/games/wordWheel/engine/wordWheel.constants'

describe('dailyIndex', () => {
  it.each([
    [6, 200, 38, 189],
    [8, 200, 19, 7],
    [10, 150, 105, 59],
    [12, 60, 13, 30],
  ])(
    'picks fixed %i x %i Kakuro puzzles on the first two days',
    (size, count, first, second) => {
      expect([
        dailyIndex({
          count,
          orderSeed: size,
          firstDay: KAKURO_FIRST_DAY,
          date: '2026-10-25',
        }),
        dailyIndex({
          count,
          orderSeed: size,
          firstDay: KAKURO_FIRST_DAY,
          date: '2026-10-26',
        }),
      ]).toEqual([first, second])
    },
  )

  it.each([
    [SLIDE_OUT_LEVEL.BEGINNER, 150, 82, 91],
    [SLIDE_OUT_LEVEL.EASY, 150, 65, 66],
    [SLIDE_OUT_LEVEL.MEDIUM, 150, 117, 97],
    [SLIDE_OUT_LEVEL.HARD, 100, 8, 9],
    [SLIDE_OUT_LEVEL.EXPERT, 60, 8, 23],
  ])(
    'picks fixed %s Slide Out puzzles on the first two days',
    (level, count, first, second) => {
      const orderSeed = SLIDE_OUT_LEVELS.indexOf(level)
      expect([
        dailyIndex({
          count,
          orderSeed,
          firstDay: SLIDE_OUT_FIRST_DAY,
          date: '2026-10-25',
        }),
        dailyIndex({
          count,
          orderSeed,
          firstDay: SLIDE_OUT_FIRST_DAY,
          date: '2026-10-26',
        }),
      ]).toEqual([first, second])
    },
  )

  it.each([
    [WORD_WHEEL_LEVEL.FIVE, 91, 172],
    [WORD_WHEEL_LEVEL.SIX, 18, 162],
    [WORD_WHEEL_LEVEL.SEVEN, 1, 46],
  ])(
    'picks fixed %s-letter Word Wheel puzzles on the first two days',
    (level, first, second) => {
      const orderSeed = WORD_WHEEL_LEVELS.indexOf(level)
      expect([
        dailyIndex({
          count: 200,
          orderSeed,
          firstDay: WORD_WHEEL_FIRST_DAY,
          date: '2026-10-25',
        }),
        dailyIndex({
          count: 200,
          orderSeed,
          firstDay: WORD_WHEEL_FIRST_DAY,
          date: '2026-10-26',
        }),
      ]).toEqual([first, second])
    },
  )
})

describe('randomIndex', () => {
  it('picks a fixed puzzle for a seed', () => {
    expect(randomIndex({ count: 150, seed: 123n })).toBe(56)
  })

  it('stays inside the bank', () => {
    expect(randomIndex({ count: 60, seed: 5n })).toBeLessThan(60)
  })
})

describe('bankLines', () => {
  it('skips blank lines', () => {
    expect(bankLines('a\n\nb\n')).toEqual(['a', 'b'])
  })
})
