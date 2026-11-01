import { describe, expect, it } from 'vitest'

import { DIFFICULTY, GAME_MODE } from '@/games/sudoku/engine/sudoku.constants'
import {
  dailyIndex,
  dailySudokuId,
  nextUnplayedIndex,
  parseDailyId,
} from '@/games/sudoku/engine/sudokuBank.functions'

describe('dailyIndex', () => {
  it.each([
    [GAME_MODE.CLASSIC, DIFFICULTY.FAST, 2737],
    [GAME_MODE.CLASSIC, DIFFICULTY.MEDIUM, 4380],
    [GAME_MODE.CLASSIC, DIFFICULTY.EXPERT, 5377],
    [GAME_MODE.KILLER, DIFFICULTY.FAST, 3934],
    [GAME_MODE.KILLER, DIFFICULTY.EVIL, 5057],
  ])('picks a fixed puzzle for %s %s', (mode, difficulty, index) => {
    expect(dailyIndex({ mode, difficulty, date: '2026-10-25' })).toBe(index)
  })
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
    const id = dailySudokuId({
      mode: GAME_MODE.KILLER,
      difficulty: DIFFICULTY.HARD,
      date: '2026-10-25',
    })

    expect([id, parseDailyId(id)]).toEqual([
      'daily_killer_hard:2026-10-25',
      { mode: GAME_MODE.KILLER, date: '2026-10-25' },
    ])
  })

  it('still reads the older id with no level', () => {
    expect(parseDailyId('daily_classic:2026-10-25')).toEqual({
      mode: GAME_MODE.CLASSIC,
      date: '2026-10-25',
    })
  })
})
