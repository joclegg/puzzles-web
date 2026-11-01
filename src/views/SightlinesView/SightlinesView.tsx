import { gameDefinition } from '@/common/game.functions'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { sizeOptions } from '@/common/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { SightlinesGameView } from '@/views/SightlinesGameView/SightlinesGameView'
import { PuzzleHomeView } from '@/views/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/common/sightlines/sightlinesSettings.constants'
import { SightlinesIcon } from '@/components/SightlinesIcon/SightlinesIcon'
import { SightlinesSettingsView } from '@/views/SightlinesSettingsView/SightlinesSettingsView'
import { PuzzleDailyView } from '@/views/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/views/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/views/PuzzleStatsView/PuzzleStatsView'

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
