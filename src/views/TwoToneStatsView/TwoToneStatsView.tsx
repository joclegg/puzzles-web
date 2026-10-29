import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/twoTone/twoTone.constants'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function TwoToneStatsView() {
  const { games } = useTwoToneGames()

  return (
    <MenuScreen accent={MENU_ACCENT.TWO_TONE}>
      <ScreenHeader title="Stats" back={[GAME_ROUTE.TWO_TONE]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </MenuScreen>
  )
}
