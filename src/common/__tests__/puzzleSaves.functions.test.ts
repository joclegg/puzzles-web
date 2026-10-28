import { describe, expect, it } from 'vitest'

import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import {
  revealPuzzle,
  dailyDate,
  dailyPuzzleId,
  inProgressPuzzles,
  sizeStats,
  solvePuzzle,
  startPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'

function start({
  games,
  id,
  size,
  now,
}: {
  games: SavedPuzzle[]
  id: string
  size: number
  now: number
}) {
  return startPuzzle({
    games,
    id: `${id}-${now}`,
    ref: { id, size, puzzle: '' },
    now,
  })
}

describe('startPuzzle', () => {
  it('keeps puzzles of other sizes and the daily, and abandons the same size', () => {
    const first = start({ games: [], id: 'random_1', size: 6, now: 1 })
    const daily = start({
      games: first.games,
      id: dailyPuzzleId({ date: '2026-10-25', size: 6 }),
      size: 6,
      now: 2,
    })
    const other = start({ games: daily.games, id: 'random_2', size: 8, now: 3 })

    const again = start({ games: other.games, id: 'random_3', size: 6, now: 4 })

    expect(inProgressPuzzles(again.games).map((game) => game.puzzleId)).toEqual(
      ['random_3', 'random_2', 'daily_2026-10-25_6'],
    )
  })
})

describe('solvePuzzle', () => {
  it('reports a new best only when faster than earlier solves of that size', () => {
    const first = start({ games: [], id: 'random_1', size: 6, now: 1 })
    const solvedOnce = solvePuzzle({
      games: first.games,
      id: first.game.id,
      elapsedMs: 5000,
      changes: '',
      hints: 0,
      now: 2,
    })
    const second = start({
      games: solvedOnce.games,
      id: 'random_2',
      size: 6,
      now: 3,
    })

    const slower = solvePuzzle({
      games: second.games,
      id: second.game.id,
      elapsedMs: 9000,
      changes: '',
      hints: 1,
      now: 4,
    })

    expect([solvedOnce.newBest, slower.newBest]).toEqual([true, false])
    expect(slower.games.at(-1)?.status).toBe(PUZZLE_STATUS.SOLVED)
  })
})

describe('sizeStats', () => {
  it('counts played, solved, best and average per size', () => {
    const first = start({ games: [], id: 'random_1', size: 4, now: 1 })
    const solved = solvePuzzle({
      games: first.games,
      id: first.game.id,
      elapsedMs: 4000,
      changes: '',
      hints: 0,
      now: 2,
    })
    const second = start({
      games: solved.games,
      id: 'random_2',
      size: 4,
      now: 3,
    })
    const both = solvePuzzle({
      games: second.games,
      id: second.game.id,
      elapsedMs: 6000,
      changes: '',
      hints: 0,
      now: 4,
    })

    expect(sizeStats({ games: both.games, sizes: [4, 6] })).toEqual([
      { size: 4, played: 2, solved: 2, bestMs: 4000, averageMs: 5000 },
      { size: 6, played: 0, solved: 0, bestMs: null, averageMs: null },
    ])
  })
})

describe('dailyDate', () => {
  it('reads the date of a daily puzzle and nothing from a random one', () => {
    expect([dailyDate('daily_2026-10-25_6'), dailyDate('random_9')]).toEqual([
      '2026-10-25',
      null,
    ])
  })
})

describe('revealPuzzle', () => {
  it('ends the puzzle without solving it', () => {
    const { games, game } = startPuzzle({
      id: 'game-1',
      games: [],
      ref: { id: 'bank_1', size: 6, puzzle: 'p' },
      now: 1,
    })

    const [revealed] = revealPuzzle({
      games,
      id: game.id,
      elapsedMs: 5,
      now: 9,
    })

    expect([revealed.status, revealed.finishedAt]).toEqual(['revealed', 9])
  })
})
