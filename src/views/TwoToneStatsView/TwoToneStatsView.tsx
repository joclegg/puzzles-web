import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/twoTone/twoTone.constants'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function TwoToneStatsView() {
  const { games } = useTwoToneGames()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.TWO_TONE]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </main>
  )
}
