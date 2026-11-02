import { describe, expect, it } from 'vitest'

import {
  addDays,
  daysBetween,
  epochDay,
  todayIso,
} from '@/shared/lib/date.functions'

describe('date functions', () => {
  it('counts the days between two dates across a month end', () => {
    expect(daysBetween({ from: '2026-10-25', to: '2026-11-01' })).toBe(7)
  })

  it('adds days across a year end', () => {
    expect(addDays({ date: '2026-12-31', days: 1 })).toBe('2027-01-01')
  })

  it('numbers days from the Unix epoch like LocalDate.toEpochDay', () => {
    expect(epochDay('1970-01-02')).toBe(1)
  })

  it('formats the local date', () => {
    expect(todayIso(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})
