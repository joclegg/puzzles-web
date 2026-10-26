import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'

export function KakuroStatsView() {
  const { games } = useKakuroGames()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.KAKURO]} />
      <SizeStatsTable
        stats={sizeStats({ games, sizes: SIZES })}
        label={sizeLabel}
      />
    </main>
  )
}
