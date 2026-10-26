import { describe, expect, it } from 'vitest'

import { puzzleTitle } from '@/common/puzzleTitle.functions'

describe('puzzleTitle', () => {
  it.each([
    ['random_5', 6, '6 x 6'],
    ['daily_2026-10-25_8', 8, 'Daily · 25 Oct · 8 x 8'],
  ])('names %s', (puzzleId, size, title) => {
    expect(puzzleTitle({ puzzleId, size })).toBe(title)
  })
})
