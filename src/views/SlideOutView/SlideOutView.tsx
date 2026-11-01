import { gameDefinition } from '@/common/game.functions'
import type { PuzzleOptions } from '@/common/game.types'
import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { LEVEL_LABEL, LEVELS } from '@/common/slideOut/slideOut.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/common/slideOut/slideOutSaves.functions'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import type { Level } from '@/common/slideOut/slideOut.types'
import { SlideOutStatsTable } from '@/components/SlideOutStatsTable/SlideOutStatsTable'
import { SlideOutGameView } from '@/views/SlideOutGameView/SlideOutGameView'
import { SlideOutHomeView } from '@/views/SlideOutHomeView/SlideOutHomeView'
import { SlideOutSettingsView } from '@/views/SlideOutSettingsView/SlideOutSettingsView'
import { PuzzleDailyView } from '@/views/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/views/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/views/PuzzleStatsView/PuzzleStatsView'

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
  const { games, openDaily } = useSlideOutGames()
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
  return <SlideOutHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
