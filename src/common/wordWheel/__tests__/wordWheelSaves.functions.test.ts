import { describe, expect, it } from 'vitest'

import {
  decodeProgress,
  encodeProgress,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'

describe('encodeProgress', () => {
  it('round-trips found words, bonus words and revealed cells', () => {
    const progress = {
      found: ['AREA'],
      bonus: ['PARE', 'RAP'],
      revealed: ['0,1'],
    }

    expect(decodeProgress(encodeProgress(progress))).toEqual(progress)
  })

  it('reads an empty save as no progress', () => {
    expect(decodeProgress('')).toEqual({ found: [], bonus: [], revealed: [] })
  })
})

describe('wordWheelTitle', () => {
  it.each([
    ['bank_six_4', 1, '6 letters'],
    ['daily_2026-10-25_seven', 2, 'Daily · 25 Oct · 7 letters'],
  ])('names %s', (puzzleId, size, title) => {
    expect(wordWheelTitle({ puzzleId, size })).toBe(title)
  })
})
