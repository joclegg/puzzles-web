import { gameDefinition } from '@/common/game.functions'
import { SIZES } from '@/common/twoTone/twoTone.constants'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import { sizeOptions } from '@/common/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { SizeStatsTable } from '@/components/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { TwoToneGameView } from '@/views/TwoToneGameView/TwoToneGameView'
import { PuzzleHomeView } from '@/views/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/common/twoTone/twoToneSettings.constants'
import { TwoToneIcon } from '@/components/TwoToneIcon/TwoToneIcon'
import { TwoToneSettingsView } from '@/views/TwoToneSettingsView/TwoToneSettingsView'
import { PuzzleDailyView } from '@/views/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/views/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/views/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.TWO_TONE)

const OPTIONS = sizeOptions(SIZES)

export function TwoToneView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useTwoToneGames()
  if (screen === SCREEN.GAME) {
    return <TwoToneGameView key={id} id={id} />
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
    return <TwoToneSettingsView />
  }
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<TwoToneIcon />}
      tagline="Fill the grid red and blue, three simple rules"
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
