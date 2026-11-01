import { gameDefinition } from '@/shared/game/game.functions'
import { SIZES } from '@/games/kakuro/engine/kakuro.constants'
import { useKakuroGames } from '@/games/kakuro/engine/kakuro.hooks'
import { sizeOptions } from '@/shared/game/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { SizeStatsTable } from '@/shared/screens/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/shared/game/puzzleSaves.functions'
import { sizeLabel } from '@/shared/game/puzzleTitle.functions'
import { KakuroGameView } from '@/games/kakuro/ui/KakuroGameView/KakuroGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/kakuro/engine/kakuroSettings.constants'
import { KakuroIcon } from '@/games/kakuro/ui/KakuroIcon/KakuroIcon'
import { KakuroSettingsView } from '@/games/kakuro/ui/KakuroSettingsView/KakuroSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

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
