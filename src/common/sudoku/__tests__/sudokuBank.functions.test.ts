import { describe, expect, it } from 'vitest'

import { addDays } from '@/common/date.functions'
import { DIFFICULTY, GAME_MODE } from '@/common/sudoku/sudoku.constants'
import {
  dailyPick,
  dailySudokuId,
  nextUnplayedIndex,
  parseDailyId,
} from '@/common/sudoku/sudokuBank.functions'

describe('dailyPick', () => {
  it.each([
    [0, GAME_MODE.CLASSIC, DIFFICULTY.MEDIUM, 2962],
    [0, GAME_MODE.KILLER, DIFFICULTY.MEDIUM, 4613],
    [1, GAME_MODE.CLASSIC, DIFFICULTY.MEDIUM, 7592],
    [1, GAME_MODE.KILLER, DIFFICULTY.HARD, 4024],
    [2, GAME_MODE.CLASSIC, DIFFICULTY.EXPERT, 7012],
    [2, GAME_MODE.KILLER, DIFFICULTY.BEGINNER, 3859],
  ])(
    'picks a fixed puzzle %i days in for %s',
    (days, mode, difficulty, index) => {
      expect(
        dailyPick({ mode, date: addDays({ date: '2026-10-25', days }) }),
      ).toEqual({
        difficulty,
        index,
      })
    },
  )
})

describe('nextUnplayedIndex', () => {
  it('skips puzzles already played', () => {
    const played = new Set(
      Array.from({ length: 9999 }, (_, i) => `classic_easy:${i}`),
    )

    expect(
      nextUnplayedIndex({
        mode: GAME_MODE.CLASSIC,
        difficulty: DIFFICULTY.EASY,
        played,
        seed: 1n,
      }),
    ).toBe(9999)
  })
})

describe('daily ids', () => {
  it('round-trips the mode and date', () => {
    const id = dailySudokuId({ mode: GAME_MODE.KILLER, date: '2026-10-25' })

    expect([id, parseDailyId(id)]).toEqual([
      'daily_killer:2026-10-25',
      { mode: GAME_MODE.KILLER, date: '2026-10-25' },
    ])
  })
})
