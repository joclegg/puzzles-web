import { describe, expect, it } from 'vitest'

import { MEDAL } from '@/shared/game/dailyMedal.constants'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  hasAllGolds,
  historyRows,
  todayMedals,
} from '@/shared/game/AllGames/AllGames.functions'
import type { AllSaves } from '@/shared/game/AllGames/AllGames.types'

const TODAY = '2026-10-25'

const NONE: AllSaves = {
  sudoku: [],
  solitaire: [],
  twoTone: [],
  sightlines: [],
  fiveLetters: [],
  kakuro: [],
  slideOut: [],
  wordWheel: [],
}

const WON_DEAL = {
  id: 'a',
  dealId: `daily_${TODAY}`,
  drawMode: 'drawOne',
  order: 'down',
  board: '',
  moves: '',
  moveCount: 3,
  elapsedMs: 1000,
  status: 'won',
  startedAt: 2,
  finishedAt: 5,
} as const

describe('todayMedals', () => {
  it('gives solitaire gold for its one daily', () => {
    const medals = todayMedals({
      saves: { ...NONE, solitaire: [WON_DEAL] },
      today: TODAY,
      dayOf: () => TODAY,
    })

    expect([medals[GAME_ROUTE.SOLITAIRE], medals[GAME_ROUTE.SUDOKU]]).toEqual([
      MEDAL.GOLD,
      MEDAL.NONE,
    ])
  })
})

describe('hasAllGolds', () => {
  it('needs gold in every game', () => {
    const golds = Object.fromEntries(
      Object.values(GAME_ROUTE).map((route) => [route, MEDAL.GOLD]),
    ) as Parameters<typeof hasAllGolds>[0]

    expect([
      hasAllGolds(golds),
      hasAllGolds({ ...golds, [GAME_ROUTE.KAKURO]: MEDAL.SILVER }),
    ]).toEqual([true, false])
  })
})

describe('historyRows', () => {
  it('lists every game newest first', () => {
    const rows = historyRows({
      ...NONE,
      solitaire: [WON_DEAL],
      fiveLetters: [
        {
          id: 'b',
          wordId: 'practice_1',
          answer: 'CRANE',
          guesses: ['CRANE'],
          hardMode: false,
          status: 'won',
          startedAt: 9,
          finishedAt: 10,
        },
      ],
    })

    expect(rows.map((row) => [row.game, row.detail])).toEqual([
      ['Five Letters', 'Won · 1 guesses'],
      ['Solitaire', 'Won · 3 moves'],
    ])
  })
})
