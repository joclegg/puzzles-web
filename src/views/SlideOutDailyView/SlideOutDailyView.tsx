import { dailyPuzzleResults } from '@/common/puzzleSaves.functions'
import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LABEL, LEVELS } from '@/common/slideOut/slideOut.constants'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function SlideOutDailyView() {
  const { games, openDaily } = useSlideOutGames()
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.SLIDE_OUT}
      route={GAME_ROUTE.SLIDE_OUT}
      results={results}
      total={LEVELS.length}
      choices={(date) =>
        LEVELS.map((level) => ({
          label: LEVEL_LABEL[level],
          done: solved.has(`${DAILY_PREFIX}${date}_${level}`),
          onPlay: () => void openDaily({ date, level }),
        }))
      }
    />
  )
}
