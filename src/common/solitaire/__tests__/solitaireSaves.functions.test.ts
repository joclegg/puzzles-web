import { describe, expect, it } from 'vitest'

import { BUILD_ORDER, DRAW_MODE } from '@/common/solitaire/solitaire.constants'
import { DEAL_STATUS } from '@/common/solitaire/solitaireSaves.constants'
import {
  dealTitle,
  drawStats,
  finishDeal,
  startDeal,
} from '@/common/solitaire/solitaireSaves.functions'

function start({ dealId, now }: { dealId: string; now: number }) {
  return {
    dealId,
    drawMode: DRAW_MODE.DRAW_ONE,
    order: BUILD_ORDER.DOWN,
    board: '',
    now,
  }
}

describe('startDeal', () => {
  it('abandons the random deal in progress and keeps the daily', () => {
    const daily = startDeal({
      id: 'game-1',
      games: [],
      deal: start({ dealId: 'daily_2026-10-25', now: 1 }),
      now: 1,
    })
    const first = startDeal({
      id: 'game-2',
      games: daily.games,
      deal: start({ dealId: 'deal_1', now: 2 }),
      now: 2,
    })

    const second = startDeal({
      id: 'game-3',
      games: first.games,
      deal: start({ dealId: 'deal_2', now: 3 }),
      now: 3,
    })

    expect(second.games.map((game) => game.status)).toEqual([
      DEAL_STATUS.IN_PROGRESS,
      DEAL_STATUS.ABANDONED,
      DEAL_STATUS.IN_PROGRESS,
    ])
  })
})

describe('finishDeal and drawStats', () => {
  it('counts wins, losses and the fewest moves per draw mode', () => {
    const first = startDeal({
      id: 'game-4',
      games: [],
      deal: start({ dealId: 'deal_1', now: 1 }),
      now: 1,
    })
    const won = finishDeal({
      games: first.games.map((game) => ({
        ...game,
        elapsedMs: 9000,
        moveCount: 120,
      })),
      id: first.game.id,
      won: true,
      now: 2,
    })
    const second = startDeal({
      id: 'game-5',
      games: won.games,
      deal: start({ dealId: 'deal_2', now: 3 }),
      now: 3,
    })
    const lost = finishDeal({
      games: second.games,
      id: second.game.id,
      won: false,
      now: 4,
    })

    expect(won.newBest).toBe(true)
    expect(
      drawStats({ games: lost.games, modes: [DRAW_MODE.DRAW_ONE] }),
    ).toEqual([
      {
        drawMode: DRAW_MODE.DRAW_ONE,
        played: 2,
        won: 1,
        bestMs: 9000,
        averageMs: 9000,
        fewestMoves: 120,
      },
    ])
  })
})

describe('dealTitle', () => {
  it('names daily and reverse deals', () => {
    const { game } = startDeal({
      id: 'game-6',
      games: [],
      deal: {
        ...start({ dealId: 'daily_2026-10-25', now: 1 }),
        order: BUILD_ORDER.UP,
      },
      now: 1,
    })

    expect(dealTitle(game)).toBe('Daily · 25 Oct · Reverse')
  })
})
