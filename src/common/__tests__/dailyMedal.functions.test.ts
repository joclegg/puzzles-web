import { describe, expect, it } from 'vitest'

import { MEDAL } from '@/common/dailyMedal.constants'
import { dailyDays, medalFor } from '@/common/dailyMedal.functions'

describe('medalFor', () => {
  it.each([
    [0, 5, MEDAL.BRONZE, MEDAL.NONE],
    [1, 5, MEDAL.BRONZE, MEDAL.BRONZE],
    [2, 5, MEDAL.BRONZE, MEDAL.SILVER],
    [5, 5, MEDAL.BRONZE, MEDAL.GOLD],
    [1, 2, MEDAL.SILVER, MEDAL.SILVER],
    [2, 2, MEDAL.SILVER, MEDAL.GOLD],
    [1, 1, MEDAL.BRONZE, MEDAL.GOLD],
  ])('%i of %i, first %s, gives %s', (count, total, firstMedal, medal) => {
    expect(medalFor({ count, total, firstMedal })).toBe(medal)
  })
})

describe('dailyDays', () => {
  it('counts each daily once and only on its own day', () => {
    const days = dailyDays({
      total: 3,
      dayOf: (ms) => (ms === 1 ? '2026-10-25' : '2026-10-26'),
      results: [
        { date: '2026-10-25', id: 'a', finishedAt: 1 },
        { date: '2026-10-25', id: 'a', finishedAt: 1 },
        { date: '2026-10-25', id: 'b', finishedAt: 2 },
      ],
    })

    expect(days.get('2026-10-25')?.medal).toBe(MEDAL.BRONZE)
  })

  it('ticks a day done only later', () => {
    const day = dailyDays({
      total: 3,
      dayOf: () => '2026-10-26',
      results: [{ date: '2026-10-25', id: 'a', finishedAt: 1 }],
    }).get('2026-10-25')

    expect([day?.medal, day?.doneLate]).toEqual([MEDAL.NONE, true])
  })
})
