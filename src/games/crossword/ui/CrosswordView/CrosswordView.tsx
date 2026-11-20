import { puzzleRecordsShare } from '@/shared/game/share.functions'
import { todayIso } from '@/shared/lib/date.functions'
import { gameDefinition } from '@/shared/game/game.functions'
import { SIZES } from '@/games/crossword/engine/crossword.constants'
import { useCrosswordGames } from '@/games/crossword/engine/crossword.hooks'
import { crosswordSizeLabel } from '@/games/crossword/engine/crosswordSaves.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { SizeStatsTable } from '@/shared/screens/SizeStatsTable/SizeStatsTable'
import {
  puzzleHistoryDetail,
  sizeStats,
} from '@/shared/game/puzzleSaves.functions'
import { CrosswordGameView } from '@/games/crossword/ui/CrosswordGameView/CrosswordGameView'
import { PuzzleHomeView } from '@/shared/screens/PuzzleHomeView/PuzzleHomeView'
import { TITLE } from '@/games/crossword/engine/crosswordSaves.constants'
import { CrosswordIcon } from '@/games/crossword/ui/CrosswordIcon/CrosswordIcon'
import { CrosswordSettingsView } from '@/games/crossword/ui/CrosswordSettingsView/CrosswordSettingsView'
import { PuzzleDailyView } from '@/shared/screens/PuzzleDailyView/PuzzleDailyView'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'
import { OPTIONS } from '@/games/crossword/ui/CrosswordView/CrosswordView.constants'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'

const DEFINITION = gameDefinition(GAME_ROUTE.CROSSWORD)

export function CrosswordView({ screen, id }: { screen: string; id: string }) {
  const { games, openGame, startRandom, openDaily } = useCrosswordGames()
  if (screen === SCREEN.GAME) {
    return <CrosswordGameView key={id} id={id} />
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
        })}
      >
        <SizeStatsTable
          stats={sizeStats({ games, sizes: SIZES })}
          label={crosswordSizeLabel}
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
        onPlay={({ date, value }) => void openDaily({ date, size: value })}
      />
    )
  }
  if (screen === SCREEN.SETTINGS) {
    return <CrosswordSettingsView />
  }
  return (
    <PuzzleHomeView
      definition={DEFINITION}
      title={TITLE}
      icon={<CrosswordIcon />}
      tagline="A British quick crossword, small to large"
      options={OPTIONS}
      dailyGridClass="grid grid-cols-3 gap-2"
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
