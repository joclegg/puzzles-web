import { dailyPuzzleResults } from '@/common/puzzleSaves.functions'
import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE } from '@/common/route.constants'
import { LEVELS } from '@/common/wordWheel/wordWheel.constants'
import { levelLabel } from '@/common/wordWheel/wordWheelSaves.functions'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function WordWheelDailyView() {
  const { games, openDaily } = useWordWheelGames()
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.WORD_WHEEL}
      route={GAME_ROUTE.WORD_WHEEL}
      results={results}
      total={LEVELS.length}
      choices={(date) =>
        LEVELS.map((level) => ({
          label: levelLabel(level),
          done: solved.has(`${DAILY_PREFIX}${date}_${level}`),
          onPlay: () => void openDaily({ date, level }),
        }))
      }
    />
  )
}
