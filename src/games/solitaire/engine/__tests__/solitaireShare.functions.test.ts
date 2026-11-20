import { describe, expect, it } from 'vitest'

import {
  BUILD_ORDER,
  DRAW_MODE,
} from '@/games/solitaire/engine/solitaire.constants'
import { DEAL_STATUS } from '@/games/solitaire/engine/solitaireSaves.constants'
import type {
  DealStatus,
  SavedDeal,
} from '@/games/solitaire/engine/solitaireSaves.types'
import {
  solitaireDailiesShare,
  solitaireRecordsShare,
} from '@/games/solitaire/engine/solitaireShare.functions'

const GAMES = [
  deal({ dealId: 'daily_2026-11-20', status: DEAL_STATUS.WON, ms: 200_000 }),
  deal({ dealId: 'random', status: DEAL_STATUS.WON, ms: 150_000, moves: 90 }),
  deal({ dealId: 'random', status: DEAL_STATUS.LOST, ms: 10_000 }),
]

describe('solitaireDailiesShare', () => {
  it.each([
    ['2026-11-20', 'Solitaire · 20 Nov 🥇\nWon in 3:20'],
    ['2026-11-19', 'Solitaire · 19 Nov\nNot won'],
  ])('on %s', (date, start) => {
    const text = solitaireDailiesShare({
      name: 'Solitaire',
      games: GAMES,
      date,
      dayOf: () => '2026-11-20',
    })

    expect(text.startsWith(`${start}\n\nLast 7 days`)).toBe(true)
  })
})

describe('solitaireRecordsShare', () => {
  it('gives the fastest win, fewest moves and win rate', () => {
    const text = solitaireRecordsShare({
      name: 'Solitaire',
      games: GAMES,
      today: '2026-11-20',
    })

    expect(text).toBe(
      'Solitaire records 🏆\nFastest win 2:30\nFewest moves 90\n\n2 wins · 66% · 🔥 1 · longest 🔥 1\njoclegg.github.io/puzzles-web',
    )
  })
})

function deal({
  dealId,
  status,
  ms,
  moves = 100,
}: {
  dealId: string
  status: DealStatus
  ms: number
  moves?: number
}): SavedDeal {
  return {
    id: `${dealId}_${ms}`,
    dealId,
    drawMode: DRAW_MODE.DRAW_ONE,
    order: BUILD_ORDER.DOWN,
    board: '',
    moves: '',
    moveCount: moves,
    elapsedMs: ms,
    status,
    startedAt: 0,
    finishedAt: 0,
  }
}
