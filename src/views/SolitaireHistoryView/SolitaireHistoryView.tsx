import { useState } from 'react'

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
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { FilterChip } from '@/components/FilterChip/FilterChip'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SolitaireHistoryView() {
  const { games } = useSolitaireGames()
  const [filter, setFilter] = useState<DrawMode | null>(null)
  const shown = games
    .filter((game) => filter === null || game.drawMode === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={MENU_ACCENT.SOLITAIRE}>
      <ScreenHeader title="History" back={[GAME_ROUTE.SOLITAIRE]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Draw mode">
        {[null, ...Object.values(DRAW_MODE)].map((mode) => (
          <FilterChip
            key={mode ?? 'all'}
            label={mode === null ? 'All' : DRAW_MODE_LABEL[mode]}
            selected={filter === mode}
            onClick={() => setFilter(mode)}
          />
        ))}
      </div>
      {shown.length === 0 ? (
        <EmptyState message="No games yet." />
      ) : (
        <ul className="flex flex-col divide-y rounded-2xl bg-card px-4 ring-1 ring-border">
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
    </MenuScreen>
  )
}
