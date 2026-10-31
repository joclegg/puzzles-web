import {
  dailyPuzzleResults,
  dailyPuzzleId,
} from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function KakuroDailyView() {
  const { games, openDaily } = useKakuroGames()
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.KAKURO}
      route={GAME_ROUTE.KAKURO}
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
