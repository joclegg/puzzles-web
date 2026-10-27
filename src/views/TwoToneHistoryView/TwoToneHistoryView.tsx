import { useState } from 'react'

import { cn } from '@/common/utils.functions'
import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/twoTone/twoTone.constants'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function TwoToneHistoryView() {
  const { games } = useTwoToneGames()
  const [filter, setFilter] = useState<number | null>(null)
  const shown = games
    .filter((game) => filter === null || game.size === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="History" back={[GAME_ROUTE.TWO_TONE]} />
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
