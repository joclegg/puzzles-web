import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DIFFICULTY_LABEL,
  GAME_MODE_LABEL,
  GAME_MODES,
  LEVELS,
} from '@/games/sudoku/engine/sudoku.constants'
import { useSudokuGames } from '@/games/sudoku/engine/sudoku.hooks'
import { dailySudokuId } from '@/games/sudoku/engine/sudokuBank.functions'
import { dailyResults } from '@/games/sudoku/engine/sudokuSaves.functions'
import { DailyCalendar } from '@/shared/screens/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export function SudokuDailyView() {
  const { games, openDaily } = useSudokuGames()
  const results = dailyResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={MENU_ACCENT.SUDOKU}
      route={GAME_ROUTE.SUDOKU}
      results={results}
      total={GAME_MODES.flatMap((mode) => LEVELS[mode]).length}
      choices={(date) =>
        GAME_MODES.flatMap((mode) =>
          LEVELS[mode].map((difficulty) => ({
            label: `${GAME_MODE_LABEL[mode]} ${DIFFICULTY_LABEL[difficulty]}`,
            done: solved.has(dailySudokuId({ mode, difficulty, date })),
            onPlay: () => void openDaily({ mode, difficulty, date }),
          })),
        )
      }
    />
  )
}
