import { useState } from 'react'

import type { GameDefinition, PuzzleOptions } from '@/shared/game/game.types'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { FilterChip } from '@/shared/screens/FilterChip/FilterChip'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { PuzzleHistoryList } from '@/shared/screens/PuzzleHistoryList/PuzzleHistoryList'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function PuzzleHistoryView<T extends number | string>({
  definition,
  games,
  options,
}: {
  definition: GameDefinition
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
}) {
  const [filter, setFilter] = useState<T | null>(null)
  const shown = games
    .filter((game) => filter === null || options.of(game) === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={definition.accent}>
      <ScreenHeader title="History" back={[definition.id]} />
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={options.filterName}
      >
        {[null, ...options.values].map((value) => (
          <FilterChip
            key={value ?? 'all'}
            label={value === null ? 'All' : options.filterLabel(value)}
            selected={filter === value}
            onClick={() => setFilter(value)}
          />
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={options.title} />
    </MenuScreen>
  )
}
