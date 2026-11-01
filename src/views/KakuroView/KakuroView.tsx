import { gameDefinition } from '@/common/game.functions'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { sizeOptions } from '@/common/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { KakuroGameView } from '@/views/KakuroGameView/KakuroGameView'
import { PuzzleHomeView } from '@/views/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/common/kakuro/kakuroSettings.constants'
import { KakuroIcon } from '@/components/KakuroIcon/KakuroIcon'
import { KakuroSettingsView } from '@/views/KakuroSettingsView/KakuroSettingsView'
import { PuzzleDailyView } from '@/views/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/views/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/views/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.KAKURO)

const OPTIONS = sizeOptions(SIZES)

export function KakuroView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useKakuroGames()
  if (screen === SCREEN.GAME) {
    return <KakuroGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return (
      <PuzzleStatsView definition={DEFINITION}>
        <SizeStatsTable
          stats={sizeStats({ games, sizes: SIZES })}
          label={sizeLabel}
        />
      </PuzzleStatsView>
    )
  }
  if (screen === SCREEN.HISTORY) {
    return (
      <PuzzleHistoryView
        definition={DEFINITION}
        games={games}
        options={OPTIONS}
      />
    )
  }
  if (screen === SCREEN.DAILY) {
    return (
      <PuzzleDailyView
        definition={DEFINITION}
        games={games}
        options={OPTIONS}
        onPlay={({ date, value }) => void openDaily({ date, size: value })}
      />
    )
  }
  if (screen === SCREEN.SETTINGS) {
    return <KakuroSettingsView />
  }
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<KakuroIcon />}
      tagline="Cross sums: runs of different digits that add up"
      options={OPTIONS}
      dailyGridClass="grid grid-cols-5 gap-2"
      usesBank={true}
      play={screen === SCREEN.PLAY ? id : undefined}
      playValue={(value) => Number(value)}
      games={games}
      openGame={openGame}
      startRandom={startRandom}
      openDaily={({ date, value }) => openDaily({ date, size: value })}
    />
  )
}
