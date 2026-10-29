import { useState } from 'react'

import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LETTERS, LEVELS } from '@/common/wordWheel/wordWheel.constants'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import type { Level } from '@/common/wordWheel/wordWheel.types'
import {
  levelOf,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { FilterChip } from '@/components/FilterChip/FilterChip'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function WordWheelHistoryView() {
  const { games } = useWordWheelGames()
  const [filter, setFilter] = useState<Level | null>(null)
  const shown = games
    .filter((game) => filter === null || levelOf(game) === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={MENU_ACCENT.WORD_WHEEL}>
      <ScreenHeader title="History" back={[GAME_ROUTE.WORD_WHEEL]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Level">
        {[null, ...LEVELS].map((level) => (
          <FilterChip
            key={level ?? 'all'}
            label={level === null ? 'All' : String(LEVEL_LETTERS[level])}
            selected={filter === level}
            onClick={() => setFilter(level)}
          />
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={wordWheelTitle} />
    </MenuScreen>
  )
}
