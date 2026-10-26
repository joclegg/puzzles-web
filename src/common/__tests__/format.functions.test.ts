import { describe, expect, it } from 'vitest'

import {
  formatDateTime,
  formatDayMonth,
  formatDuration,
} from '@/common/format.functions'

describe('formatDuration', () => {
  it.each([
    [0, '0:00'],
    [65_000, '1:05'],
    [3_726_000, '1:02:06'],
  ])('formats %i ms as %s', (ms, text) => {
    expect(formatDuration(ms)).toBe(text)
  })
})

describe('formatDayMonth', () => {
  it('shows the day and short month', () => {
    expect(formatDayMonth('2026-10-05')).toBe('5 Oct')
  })
})

describe('formatDateTime', () => {
  it('shows the date and the time', () => {
    expect(formatDateTime(new Date(2026, 9, 25, 9, 7).getTime())).toBe(
      '25 Oct 2026, 09:07',
    )
  })
})
