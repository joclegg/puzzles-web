import { describe, expect, it } from 'vitest'

import { GAME_STATUS } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import type {
  GameStatus,
  SavedGame,
} from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import {
  fiveLettersDailiesShare,
  fiveLettersRecordsShare,
} from '@/games/fiveLetters/engine/fiveLettersShare.functions'

const GAMES = [
  game({ wordId: 'daily_2026-11-20', guesses: ['crane', 'plate'] }),
  game({ wordId: 'daily2_2026-11-20', guesses: ['plate'] }),
]

describe('fiveLettersDailiesShare', () => {
  it('joins both daily grids with a blank line', () => {
    const text = fiveLettersDailiesShare({
      name: 'Five Letters',
      games: GAMES,
      date: '2026-11-20',
      dayOf: () => '2026-11-20',
    })

    expect(text).toMatch(
      /^Five Letters · 20 Nov 🥇\nFive Letters #\d+ 2\/6\n\n.+\n.+\n\nDaily puzzle 2 #\d+ 1\/6\n\n🟩🟩🟩🟩🟩\n\nLast 7 days ⬛⬛⬛⬛⬛⬛🟨\njoclegg\.github\.io\/puzzles-web$/u,
    )
  })

  it('marks the Puzzles daily as not played', () => {
    const text = fiveLettersDailiesShare({
      name: 'Five Letters',
      games: [],
      date: '2026-11-20',
      dayOf: () => '2026-11-20',
    })

    expect(text.split('\n')[1]).toBe('Puzzles daily ⬛')
  })
})

describe('fiveLettersRecordsShare', () => {
  it('draws the guess chart', () => {
    expect(
      fiveLettersRecordsShare({ name: 'Five Letters', games: GAMES }),
    ).toBe(
      'Five Letters records 🏆\n1 🟩🟩🟩🟩🟩🟩🟩🟩 1\n2 🟩🟩🟩🟩🟩🟩🟩🟩 1\n3  0\n4  0\n5  0\n6  0\n\n2/2 won · 🔥 2 · longest 🔥 2\njoclegg.github.io/puzzles-web',
    )
  })
})

function game({
  wordId,
  guesses,
  status = GAME_STATUS.WON,
}: {
  wordId: string
  guesses: string[]
  status?: GameStatus
}): SavedGame {
  return {
    id: wordId,
    wordId,
    answer: 'plate',
    guesses,
    hardMode: false,
    status,
    startedAt: 0,
    finishedAt: 0,
  }
}
