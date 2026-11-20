import { describe, expect, it } from 'vitest'

import {
  DIFFICULTY,
  GAME_MODE,
  MISTAKE_CHECK,
} from '@/games/sudoku/engine/sudoku.constants'
import type { Difficulty } from '@/games/sudoku/engine/sudoku.types'
import { SUDOKU_STATUS } from '@/games/sudoku/engine/sudokuSaves.constants'
import type { SavedSudoku } from '@/games/sudoku/engine/sudokuSaves.types'
import {
  sudokuDailiesShare,
  sudokuRecordsShare,
} from '@/games/sudoku/engine/sudokuShare.functions'

const GAMES = [
  solved({
    puzzleId: 'daily_classic_easy:2026-11-20',
    difficulty: DIFFICULTY.EASY,
    elapsedMs: 151_000,
  }),
  solved({ puzzleId: 'a', difficulty: DIFFICULTY.EASY, elapsedMs: 100_000 }),
  solved({
    puzzleId: 'daily_classic_medium:2026-11-20',
    difficulty: DIFFICULTY.MEDIUM,
    elapsedMs: 252_000,
  }),
]

describe('sudokuDailiesShare', () => {
  it('lists every daily level and stars a best time', () => {
    const text = sudokuDailiesShare({
      name: 'Sudoku',
      games: GAMES,
      pastBests: [],
      date: '2026-11-20',
      dayOf: () => '2026-11-20',
    })

    expect(text.split('\n').slice(0, 4)).toEqual([
      'Sudoku · 20 Nov 🥈',
      'Classic Fast ⬛',
      'Classic Easy 2:31',
      'Classic Medium 4:12 ⭐',
    ])
  })
})

describe('sudokuRecordsShare', () => {
  it('lists the best time of each level that has one', () => {
    const text = sudokuRecordsShare({
      name: 'Sudoku',
      games: GAMES,
      pastBests: [],
      today: '2026-11-20',
    })

    expect(text).toBe(
      'Sudoku records 🏆\nClassic Easy 1:40\nClassic Medium 4:12\n\n3 solved · 🔥 1 · longest 🔥 1\njoclegg.github.io/puzzles-web',
    )
  })
})

function solved({
  puzzleId,
  difficulty,
  elapsedMs,
}: {
  puzzleId: string
  difficulty: Difficulty
  elapsedMs: number
}): SavedSudoku {
  return {
    id: puzzleId,
    puzzleId,
    mode: GAME_MODE.CLASSIC,
    difficulty,
    custom: false,
    puzzle: '',
    values: '',
    notes: [],
    moves: '',
    elapsedMs,
    mistakes: 0,
    mistakeCheck: MISTAKE_CHECK.OFF,
    status: SUDOKU_STATUS.COMPLETED,
    startedAt: 0,
    finishedAt: 0,
  }
}
