import {
  dailyPuzzleResults,
  dailyPuzzleId,
} from '@/common/puzzleSaves.functions'
import { sizeLabel } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES } from '@/common/twoTone/twoTone.constants'
import { useTwoToneGames } from '@/common/twoTone/twoTone.hooks'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function TwoToneDailyView() {
  const { games, openDaily } = useTwoToneGames()
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.TWO_TONE}
      route={GAME_ROUTE.TWO_TONE}
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
