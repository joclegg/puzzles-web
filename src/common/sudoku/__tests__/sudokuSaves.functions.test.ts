import { describe, expect, it } from 'vitest'

import {
  DIFFICULTY,
  GAME_MODE,
  MISTAKE_CHECK,
} from '@/common/sudoku/sudoku.constants'
import { SUDOKU_STATUS } from '@/common/sudoku/sudokuSaves.constants'
import {
  bestTimes,
  dailyResults,
  finishSudoku,
  startSudoku,
  sudokuTitle,
} from '@/common/sudoku/sudokuSaves.functions'
import type { SavedSudoku, SudokuRef } from '@/common/sudoku/sudokuSaves.types'

const PUZZLE = `${'0'.repeat(81)}|${'1'.repeat(81)}|`

function playAndFinish({
  games,
  patch,
  finishedAt,
  elapsedMs = 1000,
}: {
  games: SavedSudoku[]
  patch: Partial<SudokuRef>
  finishedAt: number
  elapsedMs?: number
}) {
  const started = startSudoku({
    id: `game-${finishedAt}`,
    games,
    ref: ref(patch),
    mistakeCheck: MISTAKE_CHECK.SHOW_WRONG,
    now: finishedAt - 1,
  })
  return finishSudoku({
    games: started.games,
    id: started.game.id,
    status: SUDOKU_STATUS.COMPLETED,
    patch: { elapsedMs },
    now: finishedAt,
  })
}

function ref(patch: Partial<SudokuRef>): SudokuRef {
  return {
    puzzleId: 'classic_easy:1',
    mode: GAME_MODE.CLASSIC,
    difficulty: DIFFICULTY.EASY,
    custom: false,
    puzzle: PUZZLE,
    ...patch,
  }
}

describe('startSudoku', () => {
  it('abandons the game of the same level and keeps the daily and custom ones', () => {
    const daily = startSudoku({
      id: 'game-2',
      games: [],
      ref: ref({ puzzleId: 'daily_classic:2026-10-25' }),
      mistakeCheck: MISTAKE_CHECK.OFF,
      now: 1,
    })
    const custom = startSudoku({
      id: 'game-3',
      games: daily.games,
      ref: ref({ puzzleId: 'custom', custom: true }),
      mistakeCheck: MISTAKE_CHECK.OFF,
      now: 2,
    })
    const first = startSudoku({
      id: 'game-4',
      games: custom.games,
      ref: ref({}),
      mistakeCheck: MISTAKE_CHECK.OFF,
      now: 3,
    })

    const second = startSudoku({
      id: 'game-5',
      games: first.games,
      ref: ref({ puzzleId: 'classic_easy:2' }),
      mistakeCheck: MISTAKE_CHECK.OFF,
      now: 4,
    })

    expect(second.games.map((game) => game.status)).toEqual([
      SUDOKU_STATUS.IN_PROGRESS,
      SUDOKU_STATUS.IN_PROGRESS,
      SUDOKU_STATUS.ABANDONED,
      SUDOKU_STATUS.IN_PROGRESS,
    ])
  })
})

describe('bestTimes', () => {
  it('leaves custom puzzles out of best times', () => {
    const first = playAndFinish({
      games: [],
      patch: {},
      finishedAt: 10,
      elapsedMs: 5000,
    })
    const custom = playAndFinish({
      games: first.games,
      patch: { puzzleId: 'custom', custom: true },
      finishedAt: 20,
      elapsedMs: 1000,
    })

    const easy = bestTimes({ games: custom.games, pastBests: [] }).find(
      (it) =>
        it.mode === GAME_MODE.CLASSIC && it.difficulty === DIFFICULTY.EASY,
    )

    expect([first.newBest, easy?.bestMs, easy?.completed]).toEqual([
      true,
      5000,
      1,
    ])
  })
})

describe('dailyResults', () => {
  it('lists solved dailies, old ids included, and nothing else', () => {
    function solved({
      puzzleId,
      status = SUDOKU_STATUS.COMPLETED,
    }: {
      puzzleId: string
      status?: string
    }) {
      return { puzzleId, status, finishedAt: 1 } as SavedSudoku
    }

    expect(
      dailyResults([
        solved({ puzzleId: 'daily_classic:2026-10-25' }),
        solved({ puzzleId: 'daily_killer_hard:2026-10-25' }),
        solved({
          puzzleId: 'daily_killer_easy:2026-10-25',
          status: SUDOKU_STATUS.ABANDONED,
        }),
        solved({ puzzleId: 'classic_easy:4' }),
      ]).map((result) => result.id),
    ).toEqual(['daily_classic:2026-10-25', 'daily_killer_hard:2026-10-25'])
  })
})

describe('sudokuTitle', () => {
  it.each([
    [ref({}), 'Classic · Easy'],
    [
      ref({
        puzzleId: 'daily_killer:2026-10-25',
        mode: GAME_MODE.KILLER,
        difficulty: DIFFICULTY.HARD,
      }),
      'Daily killer · 25 Oct · Hard',
    ],
    [ref({ custom: true, difficulty: null }), 'Classic · Custom'],
  ])('names the game', (game, title) => {
    expect(sudokuTitle(game)).toBe(title)
  })

  it('counts past bests without counting them as solved', () => {
    const first = playAndFinish({
      games: [],
      patch: {},
      finishedAt: 10,
      elapsedMs: 5000,
    })

    const times = bestTimes({
      games: first.games,
      pastBests: [
        { mode: GAME_MODE.CLASSIC, difficulty: DIFFICULTY.EASY, bestMs: 2000 },
        { mode: GAME_MODE.KILLER, difficulty: DIFFICULTY.EXPERT, bestMs: 9000 },
      ],
    })

    expect(
      [
        [GAME_MODE.CLASSIC, DIFFICULTY.EASY],
        [GAME_MODE.KILLER, DIFFICULTY.EXPERT],
      ].map(([mode, difficulty]) => {
        const it = times.find(
          (time) => time.mode === mode && time.difficulty === difficulty,
        )
        return [it?.bestMs, it?.completed]
      }),
    ).toEqual([
      [2000, 1],
      [9000, 0],
    ])
  })
})
