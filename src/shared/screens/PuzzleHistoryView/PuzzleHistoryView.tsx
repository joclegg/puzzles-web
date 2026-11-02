import { useState } from 'react'

import type { GameDefinition } from '@/shared/game/game.types'
import { FilterChip } from '@/shared/screens/FilterChip/FilterChip'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { PuzzleHistoryList } from '@/shared/screens/PuzzleHistoryList/PuzzleHistoryList'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function PuzzleHistoryView<
  T extends number | string,
  G extends { id: string; elapsedMs: number; startedAt: number },
>({
  definition,
  games,
  options,
  detail,
}: {
  definition: GameDefinition
  games: G[]
  options: {
    filterName: string
    values: readonly T[]
    filterLabel: (value: T) => string
    of: (game: G) => T
    title: (game: G) => string
  }
  detail: (game: G) => string
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
      <PuzzleHistoryList games={shown} title={options.title} detail={detail} />
    </MenuScreen>
  )
}
