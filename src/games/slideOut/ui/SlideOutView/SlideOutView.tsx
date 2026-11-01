import { gameDefinition } from '@/shared/game/game.functions'
import type { PuzzleOptions } from '@/shared/game/game.types'
import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { LEVEL_LABEL, LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/games/slideOut/engine/slideOutSaves.functions'
import { useSlideOutGames } from '@/games/slideOut/engine/slideOut.hooks'
import type { Level } from '@/games/slideOut/engine/slideOut.types'
import { SlideOutStatsTable } from '@/games/slideOut/ui/SlideOutStatsTable/SlideOutStatsTable'
import { SlideOutGameView } from '@/games/slideOut/ui/SlideOutGameView/SlideOutGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/slideOut/engine/slideOutSaves.constants'
import { SlideOutIcon } from '@/games/slideOut/ui/SlideOutIcon/SlideOutIcon'
import { SlideOutSettingsView } from '@/games/slideOut/ui/SlideOutSettingsView/SlideOutSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.SLIDE_OUT)

const OPTIONS: PuzzleOptions<Level> = {
  filterName: 'Level',
  values: LEVELS,
  label: (value) => LEVEL_LABEL[value],
  filterLabel: (value) => LEVEL_LABEL[value],
  of: levelOf,
  dailyId: ({ date, value }) => `${DAILY_PREFIX}${date}_${value}`,
  title: slideOutTitle,
}

export function SlideOutView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useSlideOutGames()
  if (screen === SCREEN.GAME) {
    return <SlideOutGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return (
      <PuzzleStatsView definition={DEFINITION}>
        <SlideOutStatsTable games={games} />
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
        onPlay={({ date, value }) => void openDaily({ date, level: value })}
      />
    )
  }
  if (screen === SCREEN.SETTINGS) {
    return <SlideOutSettingsView />
  }
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<SlideOutIcon />}
      tagline="Slide the blocks to free the red one"
      options={OPTIONS}
      dailyGridClass="grid grid-cols-3 gap-2"
      usesBank={true}
      play={screen === SCREEN.PLAY ? id : undefined}
      playValue={(value) => value as Level}
      games={games}
      openGame={openGame}
      startRandom={startRandom}
      openDaily={({ date, value }) => openDaily({ date, level: value })}
    />
  )
}
