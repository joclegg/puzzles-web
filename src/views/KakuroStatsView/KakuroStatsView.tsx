import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function KakuroStatsView() {
  const { games } = useKakuroGames()

  return (
    <MenuScreen accent={MENU_ACCENT.KAKURO}>
      <ScreenHeader title="Stats" back={[GAME_ROUTE.KAKURO]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </MenuScreen>
  )
}
