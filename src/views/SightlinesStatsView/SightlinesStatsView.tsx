import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function SightlinesStatsView() {
  const { games } = useSightlinesGames()

  return (
    <MenuScreen accent={MENU_ACCENT.SIGHTLINES}>
      <ScreenHeader title="Stats" back={[GAME_ROUTE.SIGHTLINES]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </MenuScreen>
  )
}
