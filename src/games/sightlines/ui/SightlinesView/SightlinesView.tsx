import { gameDefinition } from '@/shared/game/game.functions'
import { SIZES } from '@/games/sightlines/engine/sightlines.constants'
import { useSightlinesGames } from '@/games/sightlines/engine/sightlines.hooks'
import { sizeOptions } from '@/shared/game/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { SizeStatsTable } from '@/shared/screens/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/shared/game/puzzleSaves.functions'
import { sizeLabel } from '@/shared/game/puzzleTitle.functions'
import { SightlinesGameView } from '@/games/sightlines/ui/SightlinesGameView/SightlinesGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/sightlines/engine/sightlinesSettings.constants'
import { SightlinesIcon } from '@/games/sightlines/ui/SightlinesIcon/SightlinesIcon'
import { SightlinesSettingsView } from '@/games/sightlines/ui/SightlinesSettingsView/SightlinesSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.SIGHTLINES)

const OPTIONS = sizeOptions(SIZES)

export function SightlinesView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useSightlinesGames()
  if (screen === SCREEN.GAME) {
    return <SightlinesGameView key={id} id={id} />
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
    return <SightlinesSettingsView />
  }
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<SightlinesIcon />}
      tagline="Blue dots count what they can see"
      options={OPTIONS}
      dailyGridClass="grid grid-cols-5 gap-2"
      usesBank={false}
      play={screen === SCREEN.PLAY ? id : undefined}
      playValue={(value) => Number(value)}
      games={games}
      openGame={openGame}
      startRandom={startRandom}
      openDaily={({ date, value }) => openDaily({ date, size: value })}
    />
  )
}
