import { puzzleRecordsShare } from '@/shared/game/share.functions'
import { todayIso } from '@/shared/lib/date.functions'
import { gameDefinition } from '@/shared/game/game.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { useSlideOutGames } from '@/games/slideOut/engine/slideOut.hooks'
import type { Level } from '@/games/slideOut/engine/slideOut.types'
import { SlideOutStatsTable } from '@/games/slideOut/ui/SlideOutStatsTable/SlideOutStatsTable'
import { SlideOutGameView } from '@/games/slideOut/ui/SlideOutGameView/SlideOutGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/slideOut/engine/slideOutSaves.constants'
import { SlideOutIcon } from '@/games/slideOut/ui/SlideOutIcon/SlideOutIcon'
import { SlideOutSettingsView } from '@/games/slideOut/ui/SlideOutSettingsView/SlideOutSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { puzzleHistoryDetail } from '@/shared/game/puzzleSaves.functions'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { OPTIONS } from '@/games/slideOut/ui/SlideOutView/SlideOutView.constants'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.SLIDE_OUT)

export function SlideOutView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useSlideOutGames()
  if (screen === SCREEN.GAME) {
    return <SlideOutGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return (
      <PuzzleStatsView
        definition={DEFINITION}
        share={puzzleRecordsShare({
          name: DEFINITION.name,
          games,
          options: OPTIONS,
          today: todayIso(),
          moves: true,
        })}
      >
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
        detail={puzzleHistoryDetail}
      />
    )
  }
  if (screen === SCREEN.DAILY) {
    return (
      <PuzzleDailyView
        definition={DEFINITION}
        games={games}
        options={OPTIONS}
        moves
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
