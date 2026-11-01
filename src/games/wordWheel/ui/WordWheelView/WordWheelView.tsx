import { gameDefinition } from '@/shared/game/game.functions'
import type { PuzzleOptions } from '@/shared/game/game.types'
import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import {
  LEVEL_LETTERS,
  LEVELS,
} from '@/games/wordWheel/engine/wordWheel.constants'
import {
  levelLabel,
  levelOf,
  wordWheelTitle,
} from '@/games/wordWheel/engine/wordWheelSaves.functions'
import { useWordWheelGames } from '@/games/wordWheel/engine/wordWheel.hooks'
import type { Level } from '@/games/wordWheel/engine/wordWheel.types'
import { WordWheelStatsTable } from '@/games/wordWheel/ui/WordWheelStatsTable/WordWheelStatsTable'
import { WordWheelGameView } from '@/games/wordWheel/ui/WordWheelGameView/WordWheelGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/wordWheel/engine/wordWheelSaves.constants'
import { WordWheelIcon } from '@/games/wordWheel/ui/WordWheelIcon/WordWheelIcon'
import { WordWheelSettingsView } from '@/games/wordWheel/ui/WordWheelSettingsView/WordWheelSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

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
  const { games, openGame, startRandom, openDaily } = useWordWheelGames()
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
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<WordWheelIcon />}
      tagline="Swipe the letters to fill the crossword"
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
