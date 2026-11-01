import { gameDefinition } from '@/shared/game/game.functions'
import { SIZES } from '@/games/twoTone/engine/twoTone.constants'
import { useTwoToneGames } from '@/games/twoTone/engine/twoTone.hooks'
import { sizeOptions } from '@/shared/game/puzzleOptions.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { SizeStatsTable } from '@/shared/screens/SizeStatsTable/SizeStatsTable'
import { sizeStats } from '@/shared/game/puzzleSaves.functions'
import { sizeLabel } from '@/shared/game/puzzleTitle.functions'
import { TwoToneGameView } from '@/games/twoTone/ui/TwoToneGameView/TwoToneGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/twoTone/engine/twoToneSettings.constants'
import { TwoToneIcon } from '@/games/twoTone/ui/TwoToneIcon/TwoToneIcon'
import { TwoToneSettingsView } from '@/games/twoTone/ui/TwoToneSettingsView/TwoToneSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

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
