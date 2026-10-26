import { formatDayMonth } from '@/common/format.functions'
import {
  BUILD_ORDER,
  DRAW_MODE_LABEL,
} from '@/common/solitaire/solitaire.constants'
import type { DrawMode } from '@/common/solitaire/solitaire.types'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
  RANDOM_SLOT,
} from '@/common/solitaire/solitaireSaves.constants'
import type {
  DrawStats,
  SavedDeal,
} from '@/common/solitaire/solitaireSaves.types'

export function dealTitle(deal: SavedDeal): string {
  const kind = isDailyDeal(deal.dealId)
    ? `Daily · ${formatDayMonth(deal.dealId.slice(DAILY_PREFIX.length))}`
    : DRAW_MODE_LABEL[deal.drawMode]
  return deal.order === BUILD_ORDER.UP ? `${kind} · Reverse` : kind
}

export function drawStats({
  games,
  modes,
}: {
  games: SavedDeal[]
  modes: readonly DrawMode[]
}): DrawStats[] {
  return modes.map((drawMode) => {
    const finished = games.filter(
      (game) =>
        game.drawMode === drawMode && game.status !== DEAL_STATUS.IN_PROGRESS,
    )
    const won = finished.filter((game) => game.status === DEAL_STATUS.WON)
    const times = won.map((game) => game.elapsedMs)
    return {
      drawMode,
      played: finished.length,
      won: won.length,
      bestMs: times.length > 0 ? Math.min(...times) : null,
      averageMs:
        times.length > 0
          ? Math.floor(times.reduce((sum, ms) => sum + ms, 0) / times.length)
          : null,
      fewestMoves:
        won.length > 0 ? Math.min(...won.map((game) => game.moveCount)) : null,
    }
  })
}

export function finishDeal({
  games,
  id,
  won,
  now,
}: {
  games: SavedDeal[]
  id: number
  won: boolean
  now: number
}): { games: SavedDeal[]; newBest: boolean } {
  const finished = games.find((game) => game.id === id)
  const previous = games
    .filter(
      (game) =>
        game.id !== id &&
        game.drawMode === finished?.drawMode &&
        game.status === DEAL_STATUS.WON,
    )
    .map((game) => game.elapsedMs)
  const status = won ? DEAL_STATUS.WON : DEAL_STATUS.LOST
  return {
    games: games.map((game) =>
      game.id === id ? { ...game, status, finishedAt: now } : game,
    ),
    newBest:
      won &&
      finished !== undefined &&
      (previous.length === 0 || finished.elapsedMs < Math.min(...previous)),
  }
}

export function isDailyDeal(dealId: string): boolean {
  return dealId.startsWith(DAILY_PREFIX)
}

export function startDeal({
  games,
  deal,
  now,
}: {
  games: SavedDeal[]
  deal: Pick<SavedDeal, 'dealId' | 'drawMode' | 'order' | 'board'>
  now: number
}): { games: SavedDeal[]; game: SavedDeal } {
  const slot = slotOf(deal.dealId)
  const kept = games.map((game) =>
    game.status === DEAL_STATUS.IN_PROGRESS && slotOf(game.dealId) === slot
      ? { ...game, status: DEAL_STATUS.ABANDONED }
      : game,
  )
  const game: SavedDeal = {
    ...deal,
    id: games.reduce((highest, it) => Math.max(highest, it.id), 0) + 1,
    moves: '',
    moveCount: 0,
    elapsedMs: 0,
    status: DEAL_STATUS.IN_PROGRESS,
    startedAt: now,
    finishedAt: null,
  }
  return { games: [...kept, game], game }
}

function slotOf(dealId: string): string {
  return isDailyDeal(dealId) ? dealId : RANDOM_SLOT
}
