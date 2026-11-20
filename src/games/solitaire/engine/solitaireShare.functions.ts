import { dailyDays } from '@/shared/game/dailyMedal.functions'
import {
  dailiesShareText,
  dailyStreaks,
  recordsShareText,
  streakSummary,
} from '@/shared/game/share.functions'
import { formatDuration } from '@/shared/lib/format.functions'
import { DRAW_MODE } from '@/games/solitaire/engine/solitaire.constants'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
} from '@/games/solitaire/engine/solitaireSaves.constants'
import {
  dailyResults,
  drawStats,
} from '@/games/solitaire/engine/solitaireSaves.functions'
import type { SavedDeal } from '@/games/solitaire/engine/solitaireSaves.types'

export function solitaireDailiesShare({
  name,
  games,
  date,
  dayOf,
}: {
  name: string
  games: SavedDeal[]
  date: string
  dayOf: (ms: number) => string
}): string {
  const won = games.find(
    (game) =>
      game.dealId === `${DAILY_PREFIX}${date}` &&
      game.status === DEAL_STATUS.WON,
  )
  return dailiesShareText({
    name,
    date,
    body: won ? `Won in ${formatDuration(won.elapsedMs)}` : 'Not won',
    days: dailyDays({ results: dailyResults(games), total: 1, dayOf }),
  })
}

export function solitaireRecordsShare({
  name,
  games,
  today,
}: {
  name: string
  games: SavedDeal[]
  today: string
}): string {
  const stats = drawStats({ games, modes: Object.values(DRAW_MODE) })
  const played = stats.reduce((sum, mode) => sum + mode.played, 0)
  const wins = stats.reduce((sum, mode) => sum + mode.won, 0)
  const times = stats.flatMap((mode) =>
    mode.bestMs === null ? [] : [mode.bestMs],
  )
  const moves = stats.flatMap((mode) =>
    mode.fewestMoves === null ? [] : [mode.fewestMoves],
  )
  const { current, longest } = dailyStreaks({
    results: dailyResults(games),
    today,
  })
  const percent = played === 0 ? 0 : Math.floor((wins * 100) / played)
  return recordsShareText({
    name,
    lines: [
      ...(times.length > 0
        ? [`Fastest win ${formatDuration(Math.min(...times))}`]
        : []),
      ...(moves.length > 0 ? [`Fewest moves ${Math.min(...moves)}`] : []),
    ],
    summary: streakSummary({
      lead: `${wins} wins · ${percent}%`,
      current,
      longest,
    }),
  })
}
