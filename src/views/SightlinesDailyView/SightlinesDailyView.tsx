import {
  dailyPuzzleResults,
  dailyPuzzleId,
} from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function SightlinesDailyView() {
  const { games, openDaily } = useSightlinesGames()
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.SIGHTLINES}
      route={GAME_ROUTE.SIGHTLINES}
      results={results}
      total={SIZES.length}
      choices={(date) =>
        SIZES.map((size) => ({
          label: sizeLabel(size),
          done: solved.has(dailyPuzzleId({ date, size })),
          onPlay: () => void openDaily({ date, size }),
        }))
      }
    />
  )
}
