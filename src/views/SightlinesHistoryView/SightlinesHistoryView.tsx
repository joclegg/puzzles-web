import { useState } from 'react'

import { cn } from '@/common/utils.functions'
import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SightlinesHistoryView() {
  const { games } = useSightlinesGames()
  const [filter, setFilter] = useState<number | null>(null)
  const shown = games
    .filter((game) => filter === null || game.size === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="History" back={[GAME_ROUTE.SIGHTLINES]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Size">
        {[null, ...SIZES].map((size) => (
          <button
            key={size ?? 'all'}
            type="button"
            aria-pressed={filter === size}
            onClick={() => setFilter(size)}
            className={cn(
              'rounded-full px-3 py-1 text-sm ring-1 ring-border',
              filter === size && 'bg-primary text-primary-foreground',
            )}
          >
            {size ?? 'All'}
          </button>
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={puzzleTitle} />
    </main>
  )
}
