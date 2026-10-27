import { useState } from 'react'

import { cn } from '@/common/utils.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LETTERS, LEVELS } from '@/common/wordWheel/wordWheel.constants'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import type { Level } from '@/common/wordWheel/wordWheel.types'
import {
  levelOf,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function WordWheelHistoryView() {
  const { games } = useWordWheelGames()
  const [filter, setFilter] = useState<Level | null>(null)
  const shown = games
    .filter((game) => filter === null || levelOf(game) === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="History" back={[GAME_ROUTE.WORD_WHEEL]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Level">
        {[null, ...LEVELS].map((level) => (
          <button
            key={level ?? 'all'}
            type="button"
            aria-pressed={filter === level}
            onClick={() => setFilter(level)}
            className={cn(
              'rounded-full px-3 py-1 text-sm ring-1 ring-border',
              filter === level && 'bg-primary text-primary-foreground',
            )}
          >
            {level === null ? 'All' : LEVEL_LETTERS[level]}
          </button>
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={wordWheelTitle} />
    </main>
  )
}
