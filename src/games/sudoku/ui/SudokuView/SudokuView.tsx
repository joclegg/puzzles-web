import { SCREEN } from '@/shared/lib/route.constants'
import { SudokuDailyView } from '@/games/sudoku/ui/SudokuDailyView/SudokuDailyView'
import { SudokuEntryView } from '@/games/sudoku/ui/SudokuEntryView/SudokuEntryView'
import { SudokuGameView } from '@/games/sudoku/ui/SudokuGameView/SudokuGameView'
import { SudokuHistoryView } from '@/games/sudoku/ui/SudokuHistoryView/SudokuHistoryView'
import { SudokuHomeView } from '@/games/sudoku/ui/SudokuHomeView/SudokuHomeView'
import { SudokuSettingsView } from '@/games/sudoku/ui/SudokuSettingsView/SudokuSettingsView'
import { SudokuStatsView } from '@/games/sudoku/ui/SudokuStatsView/SudokuStatsView'

export function SudokuView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <SudokuGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <SudokuStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <SudokuHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SudokuSettingsView />
  }
  if (screen === SCREEN.DAILY) {
    return <SudokuDailyView />
  }
  if (screen === SCREEN.ENTRY) {
    return <SudokuEntryView />
  }
  return <SudokuHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
