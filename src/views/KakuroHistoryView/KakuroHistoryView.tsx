import { useState } from 'react'

import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { PuzzleHistoryList } from '@/components/PuzzleHistoryList/PuzzleHistoryList'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { FilterChip } from '@/components/FilterChip/FilterChip'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function KakuroHistoryView() {
  const { games } = useKakuroGames()
  const [filter, setFilter] = useState<number | null>(null)
  const shown = games
    .filter((game) => filter === null || game.size === filter)
    .sort((a, b) => b.startedAt - a.startedAt)

  return (
    <MenuScreen accent={MENU_ACCENT.KAKURO}>
      <ScreenHeader title="History" back={[GAME_ROUTE.KAKURO]} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Size">
        {[null, ...SIZES].map((size) => (
          <FilterChip
            key={size ?? 'all'}
            label={String(size ?? 'All')}
            selected={filter === size}
            onClick={() => setFilter(size)}
          />
        ))}
      </div>
      <PuzzleHistoryList games={shown} title={puzzleTitle} />
    </MenuScreen>
  )
}
