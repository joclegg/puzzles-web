import { useState } from 'react'

import { cn } from '@/common/utils.functions'
import { formatDateTime, formatDuration } from '@/common/format.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import {
  DRAW_MODE,
  DRAW_MODE_LABEL,
} from '@/common/solitaire/solitaire.constants'
import type { DrawMode } from '@/common/solitaire/solitaire.types'
import { useSolitaireGames } from '@/common/solitaire/solitaire.hooks'
import { DEAL_STATUS_LABEL } from '@/common/solitaire/solitaireSaves.constants'
import { dealTitle } from '@/common/solitaire/solitaireSaves.functions'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SolitaireHistoryView() {
  const { games } = useSolitaireGames()
  const [filter, setFilter] = useState<DrawMode | null>(null)
  const shown = games
    .filter((game) => filter === null || game.drawMode === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="History" back={[GAME_ROUTE.SOLITAIRE]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Draw mode">
        {[null, ...Object.values(DRAW_MODE)].map((mode) => (
          <button
            key={mode ?? 'all'}
            type="button"
            aria-pressed={filter === mode}
            onClick={() => setFilter(mode)}
            className={cn(
              'rounded-full px-3 py-1 text-sm ring-1 ring-border',
              filter === mode && 'bg-primary text-primary-foreground',
            )}
          >
            {mode === null ? 'All' : DRAW_MODE_LABEL[mode]}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-muted-foreground">No games yet.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {shown.map((game) => (
            <li key={game.id} className="flex items-center gap-2 py-3">
              <span className="flex-1">
                <span className="block font-medium">{dealTitle(game)}</span>
                <span className="block text-sm text-muted-foreground">
                  {DEAL_STATUS_LABEL[game.status]} · {game.moveCount} moves
                </span>
              </span>
              <span className="text-right text-sm">
                <span className="block">{formatDuration(game.elapsedMs)}</span>
                <span className="block text-muted-foreground">
                  {formatDateTime(game.startedAt)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
