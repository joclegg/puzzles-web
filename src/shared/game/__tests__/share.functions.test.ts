import { describe, expect, it } from 'vitest'

import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { DailyDay } from '@/shared/game/dailyMedal.types'
import { PUZZLE_STATUS } from '@/shared/game/puzzleSaves.constants'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { sizeOptions } from '@/shared/game/puzzleOptions.functions'
import {
  dailiesShareText,
  dailyLine,
  dailyStreaks,
  guessChart,
  lastSevenDays,
  puzzleDailiesShare,
  puzzleRecordsShare,
  puzzleWinShare,
  recordsShareText,
  streakSummary,
} from '@/shared/game/share.functions'

const DAYS = new Map<string, DailyDay>([
  ['2026-11-14', day({ date: '2026-11-14', medal: MEDAL.GOLD })],
  ['2026-11-15', day({ date: '2026-11-15', medal: MEDAL.GOLD })],
  ['2026-11-16', day({ date: '2026-11-16', medal: MEDAL.SILVER })],
  ['2026-11-17', day({ date: '2026-11-17', medal: MEDAL.GOLD })],
  ['2026-11-18', day({ date: '2026-11-18', medal: MEDAL.GOLD })],
  ['2026-11-20', day({ date: '2026-11-20', medal: MEDAL.SILVER })],
])

const OPTIONS = sizeOptions([4, 6])

describe('dailiesShareText', () => {
  it('matches the spec example', () => {
    const body = [
      dailyLine({ label: 'Easy', ms: 151_000 }),
      dailyLine({ label: 'Medium', ms: 252_000, best: true }),
      dailyLine({ label: 'Hard', ms: 588_000 }),
      dailyLine({ label: 'Expert', ms: null }),
    ].join('\n')

    const text = dailiesShareText({
      name: 'Sudoku',
      date: '2026-11-20',
      body,
      days: DAYS,
    })

    expect(text).toBe(
      'Sudoku · 20 Nov 🥈\nEasy 2:31\nMedium 4:12 ⭐\nHard 9:48\nExpert ⬛\n\nLast 7 days 🟨🟨⬜🟨🟨⬛⬜\njoclegg.github.io/puzzles-web',
    )
  })

  it('leaves the medal out when there is none', () => {
    const text = dailiesShareText({
      name: 'Solitaire',
      date: '2026-11-19',
      body: 'Not won',
      days: DAYS,
    })

    expect(text.split('\n')[0]).toBe('Solitaire · 19 Nov')
  })
})

describe('dailyLine', () => {
  it('adds the moves before the star', () => {
    expect(dailyLine({ label: 'Easy', ms: 61_000, best: true, moves: 9 })).toBe(
      'Easy 1:01 · 9 moves ⭐',
    )
  })
})

describe('dailyStreaks', () => {
  it.each([
    ['2026-11-20', 1, 3],
    ['2026-11-19', 3, 3],
    ['2026-11-22', 0, 3],
  ])('on %s gives %i current and %i longest', (today, current, longest) => {
    const results = [
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
      '2026-11-20',
    ].map((date) => ({ date, id: date, finishedAt: 0 }))

    expect(dailyStreaks({ results, today })).toEqual({ current, longest })
  })
})

describe('guessChart', () => {
  it('scales the largest bucket to eight squares', () => {
    expect(guessChart([0, 1, 16, 4, 0, 0])).toBe(
      '1  0\n2 🟩 1\n3 🟩🟩🟩🟩🟩🟩🟩🟩 16\n4 🟩🟩 4\n5  0\n6  0',
    )
  })
})

describe('lastSevenDays', () => {
  it('ends on the given day', () => {
    expect(lastSevenDays({ days: DAYS, date: '2026-11-18' })).toBe(
      '⬛⬛🟨🟨⬜🟨🟨',
    )
  })
})

describe('puzzleDailiesShare', () => {
  it('stars a daily that equals the best for its size', () => {
    const games = [
      saved({ puzzleId: 'daily_2026-11-20_4', size: 4, elapsedMs: 30_000 }),
      saved({ puzzleId: 'level', size: 4, elapsedMs: 40_000 }),
      saved({ puzzleId: 'level', size: 6, elapsedMs: 10_000 }),
    ]

    const text = puzzleDailiesShare({
      name: 'Two Tone',
      games,
      options: OPTIONS,
      date: '2026-11-20',
      dayOf: () => '2026-11-20',
    })

    expect(text).toBe(
      'Two Tone · 20 Nov 🥉\n4 x 4 0:30 ⭐\n6 x 6 ⬛\n\nLast 7 days ⬛⬛⬛⬛⬛⬛🟧\njoclegg.github.io/puzzles-web',
    )
  })
})

describe('puzzleRecordsShare', () => {
  it('lists the best per size with moves and the streaks', () => {
    const games = [
      saved({
        puzzleId: 'daily_2026-11-20_4',
        size: 4,
        elapsedMs: 30_000,
        moveCount: 12,
      }),
      saved({ puzzleId: 'level', size: 4, elapsedMs: 20_000, moveCount: 15 }),
    ]

    const text = puzzleRecordsShare({
      name: 'Slide Out',
      games,
      options: OPTIONS,
      today: '2026-11-20',
      moves: true,
    })

    expect(text).toBe(
      'Slide Out records 🏆\n4 x 4 0:20 · 12 moves\n\n2 solved · 🔥 1 · longest 🔥 1\njoclegg.github.io/puzzles-web',
    )
  })
})

describe('puzzleWinShare', () => {
  it('shares nothing for a puzzle that is not a daily', () => {
    expect(
      puzzleWinShare({
        name: 'Two Tone',
        games: [],
        options: OPTIONS,
        puzzleId: 'level',
        dayOf: () => '2026-11-20',
      }),
    ).toBeUndefined()
  })
})

describe('recordsShareText', () => {
  it('puts a blank line before the summary', () => {
    expect(
      recordsShareText({
        name: 'Kakuro',
        lines: ['6 x 6 1:00'],
        summary: streakSummary({ lead: '3 solved', current: 2, longest: 5 }),
      }),
    ).toBe(
      'Kakuro records 🏆\n6 x 6 1:00\n\n3 solved · 🔥 2 · longest 🔥 5\njoclegg.github.io/puzzles-web',
    )
  })
})

function day({ date, medal }: Pick<DailyDay, 'date' | 'medal'>): DailyDay {
  return { date, medal, doneLate: false }
}

function saved({
  puzzleId,
  size,
  elapsedMs,
  moveCount,
}: {
  puzzleId: string
  size: number
  elapsedMs: number
  moveCount?: number
}): SavedPuzzle {
  return {
    id: `${puzzleId}_${elapsedMs}`,
    puzzleId,
    size,
    puzzle: '',
    changes: '',
    moveCount,
    elapsedMs,
    hints: 0,
    mistakes: 0,
    status: PUZZLE_STATUS.SOLVED,
    startedAt: 0,
    finishedAt: 0,
  }
}
