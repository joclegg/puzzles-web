import { describe, expect, it } from 'vitest'

import { LEVEL } from '@/common/wordWheel/wordWheel.constants'
import { dailyIndex } from '@/common/wordWheel/wordWheelBank.functions'

describe('dailyIndex', () => {
  it.each([
    [LEVEL.FIVE, 91, 172],
    [LEVEL.SIX, 18, 162],
    [LEVEL.SEVEN, 1, 46],
  ])(
    'picks fixed %s-letter puzzles on the first two days',
    (level, first, second) => {
      expect([
        dailyIndex({ count: 200, level, date: '2026-10-25' }),
        dailyIndex({ count: 200, level, date: '2026-10-26' }),
      ]).toEqual([first, second])
    },
  )
})
