import { useState } from 'react'

import { formatDateTime, formatDuration } from '@/shared/lib/format.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/games/sudoku/engine/sudoku.constants'
import { useSudokuGames } from '@/games/sudoku/engine/sudoku.hooks'
import type { GameMode } from '@/games/sudoku/engine/sudoku.types'
import { SUDOKU_STATUS_LABEL } from '@/games/sudoku/engine/sudokuSaves.constants'
import { sudokuTitle } from '@/games/sudoku/engine/sudokuSaves.functions'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { FilterChip } from '@/shared/screens/FilterChip/FilterChip'
import { EmptyState } from '@/shared/screens/EmptyState/EmptyState'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function SudokuHistoryView() {
  const { games } = useSudokuGames()
  const [filter, setFilter] = useState<GameMode | null>(null)
  const shown = games
    .filter((game) => filter === null || game.mode === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="History" back={[GAME_ROUTE.SUDOKU]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
        {[null, ...GAME_MODES].map((mode) => (
          <FilterChip
            key={mode ?? 'all'}
            label={mode === null ? 'All' : GAME_MODE_LABEL[mode]}
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
                <span className="block font-medium">{sudokuTitle(game)}</span>
                <span className="block text-sm text-muted-foreground">
                  {SUDOKU_STATUS_LABEL[game.status]} · {game.mistakes} mistakes
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
