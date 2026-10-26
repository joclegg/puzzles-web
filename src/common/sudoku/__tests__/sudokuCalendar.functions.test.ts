import { describe, expect, it } from 'vitest'

import {
  addMonths,
  monthDays,
  monthLabel,
} from '@/common/sudoku/sudokuCalendar.functions'

describe('monthDays', () => {
  it('starts the month on its weekday with Monday first', () => {
    const days = monthDays('2026-10')

    expect([days.slice(0, 4), days.length]).toEqual([
      [null, null, null, '2026-10-01'],
      34,
    ])
  })
})

describe('addMonths', () => {
  it.each([
    ['2026-12', 1, '2027-01'],
    ['2026-01', -1, '2025-12'],
  ])('moves %s by %i months', (month, count, expected) => {
    expect(addMonths({ month, count })).toBe(expected)
  })
})

describe('monthLabel', () => {
  it('names the month', () => {
    expect(monthLabel('2026-10')).toBe('October 2026')
  })
})
