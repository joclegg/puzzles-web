import { gameDefinition } from '@/common/game.functions'
import type { PuzzleOptions } from '@/common/game.types'
import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { LEVEL_LETTERS, LEVELS } from '@/common/wordWheel/wordWheel.constants'
import {
  levelLabel,
  levelOf,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import type { Level } from '@/common/wordWheel/wordWheel.types'
import { WordWheelStatsTable } from '@/components/WordWheelStatsTable/WordWheelStatsTable'
import { WordWheelGameView } from '@/views/WordWheelGameView/WordWheelGameView'
import { WordWheelHomeView } from '@/views/WordWheelHomeView/WordWheelHomeView'
import { WordWheelSettingsView } from '@/views/WordWheelSettingsView/WordWheelSettingsView'
import { PuzzleDailyView } from '@/views/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/views/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/views/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.WORD_WHEEL)

const OPTIONS: PuzzleOptions<Level> = {
  filterName: 'Level',
  values: LEVELS,
  label: (value) => levelLabel(value),
  filterLabel: (value) => String(LEVEL_LETTERS[value]),
  of: levelOf,
  dailyId: ({ date, value }) => `${DAILY_PREFIX}${date}_${value}`,
  title: wordWheelTitle,
}

export function WordWheelView({ screen, id }: { screen: string; id: string }) {
  const { games, openDaily } = useWordWheelGames()
  if (screen === SCREEN.GAME) {
    return <WordWheelGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return (
      <PuzzleStatsView definition={DEFINITION}>
        <WordWheelStatsTable games={games} />
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
    return <WordWheelSettingsView />
  }
  return <WordWheelHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
