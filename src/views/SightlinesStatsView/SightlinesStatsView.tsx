import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function SightlinesStatsView() {
  const { games } = useSightlinesGames()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.SIGHTLINES]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </main>
  )
}
