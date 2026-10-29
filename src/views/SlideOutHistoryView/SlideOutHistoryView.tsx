import { useState } from 'react'

import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LABEL, LEVELS } from '@/common/slideOut/slideOut.constants'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import type { Level } from '@/common/slideOut/slideOut.types'
import {
  levelOf,
  slideOutTitle,
} from '@/common/slideOut/slideOutSaves.functions'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { FilterChip } from '@/components/FilterChip/FilterChip'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SlideOutHistoryView() {
  const { games } = useSlideOutGames()
  const [filter, setFilter] = useState<Level | null>(null)
  const shown = games
    .filter((game) => filter === null || levelOf(game) === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={MENU_ACCENT.SLIDE_OUT}>
      <ScreenHeader title="History" back={[GAME_ROUTE.SLIDE_OUT]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Level">
        {[null, ...LEVELS].map((level) => (
          <FilterChip
            key={level ?? 'all'}
            label={level === null ? 'All' : LEVEL_LABEL[level]}
            selected={filter === level}
            onClick={() => setFilter(level)}
          />
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={slideOutTitle} />
    </MenuScreen>
  )
}
