import { describe, expect, it } from 'vitest'

import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  finishGame,
  inProgress,
  isNyt,
  nytId,
  nytLabel,
  slotOf,
  startGame,
  statsOf,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import type { SavedGame } from '@/common/fiveLetters/fiveLettersSaves.types'

function finished({
  id,
  won,
  guesses,
}: {
  id: string
  won: boolean
  guesses: number
}): SavedGame {
  return {
    id,
    wordId: `practice_${id}`,
    answer: 'CRANE',
    guesses: Array.from({ length: guesses }, () => 'ADIEU'),
    hardMode: false,
    status: won ? GAME_STATUS.WON : GAME_STATUS.LOST,
    startedAt: Number(id),
    finishedAt: Number(id),
  }
}

describe('startGame', () => {
  it('abandons the practice game in progress and keeps the daily', () => {
    const daily = startGame({
      id: 'game-1',
      games: [],
      ref: { id: 'daily_2026-10-25', answer: 'SLATE' },
      hardMode: false,
      now: 1,
    })
    const first = startGame({
      id: 'game-2',
      games: daily.games,
      ref: { id: 'practice_1', answer: 'CRANE' },
      hardMode: false,
      now: 2,
    })

    const second = startGame({
      id: 'game-3',
      games: first.games,
      ref: { id: 'practice_2', answer: 'TRACE' },
      hardMode: false,
      now: 3,
    })

    expect(inProgress(second.games).map((game) => game.wordId)).toEqual([
      'daily_2026-10-25',
      'practice_2',
    ])
  })
})

describe('finishGame', () => {
  it('marks the game won with its guesses', () => {
    const { games, game } = startGame({
      id: 'game-4',
      games: [],
      ref: { id: 'practice_1', answer: 'CRANE' },
      hardMode: true,
      now: 1,
    })

    const after = finishGame({
      games,
      id: game.id,
      guesses: ['CRANE'],
      won: true,
      now: 5,
    })

    expect(after[0]).toMatchObject({ status: GAME_STATUS.WON, finishedAt: 5 })
  })
})

describe('statsOf', () => {
  it('counts wins, streaks and guesses per win', () => {
    const games = [
      finished({ id: '1', won: true, guesses: 3 }),
      finished({ id: '2', won: true, guesses: 4 }),
      finished({ id: '3', won: false, guesses: 6 }),
      finished({ id: '4', won: true, guesses: 3 }),
    ]

    const stats = statsOf(games)

    expect(stats).toEqual({
      played: 4,
      won: 3,
      currentStreak: 1,
      maxStreak: 2,
      guessCounts: [0, 0, 2, 1, 0, 0],
    })
  })
})

describe('the NY Times daily', () => {
  it('has its own id and slot for each date', () => {
    const id = nytId('2026-10-26')

    expect([id, isNyt(id), slotOf(id)]).toEqual([
      'nyt_2026-10-26',
      true,
      'nyt_2026-10-26',
    ])
  })

  it('never shares a slot with the Puzzles daily', () => {
    expect(slotOf(nytId('2026-10-26'))).not.toBe(slotOf('daily_2026-10-26'))
  })

  it('is labelled with its date', () => {
    expect(nytLabel(nytId('2026-03-05'))).toBe('NY Times · 5 Mar')
  })
})
