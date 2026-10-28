import { describe, expect, it } from 'vitest'

import { solvePuzzle, startPuzzle } from '@/common/puzzleSaves.functions'
import { LEVEL } from '@/common/slideOut/slideOut.constants'
import {
  levelStats,
  slideOutTitle,
} from '@/common/slideOut/slideOutSaves.functions'

describe('slideOutTitle', () => {
  it.each([
    ['bank_medium_3', 2, 'Medium'],
    ['daily_2026-10-25_expert', 4, 'Daily · 25 Oct · Expert'],
  ])('names %s', (puzzleId, size, title) => {
    expect(slideOutTitle({ puzzleId, size })).toBe(title)
  })
})

describe('levelStats', () => {
  it('counts puzzles solved at par', () => {
    const started = startPuzzle({
      id: 'game-1',
      games: [],
      ref: { id: 'bank_beginner_0', size: 0, puzzle: '1;242H' },
      now: 1,
    })
    const { games } = solvePuzzle({
      games: started.games,
      id: started.game.id,
      elapsedMs: 3000,
      changes: '0:4',
      hints: 0,
      now: 2,
    })

    expect(levelStats(games)[0]).toEqual({
      level: LEVEL.BEGINNER,
      played: 1,
      solved: 1,
      atPar: 1,
      bestMs: 3000,
    })
  })
})
