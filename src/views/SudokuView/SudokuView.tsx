import { SCREEN } from '@/common/route.constants'
import { SudokuDailyView } from '@/views/SudokuDailyView/SudokuDailyView'
import { SudokuEntryView } from '@/views/SudokuEntryView/SudokuEntryView'
import { SudokuGameView } from '@/views/SudokuGameView/SudokuGameView'
import { SudokuHistoryView } from '@/views/SudokuHistoryView/SudokuHistoryView'
import { SudokuHomeView } from '@/views/SudokuHomeView/SudokuHomeView'
import { SudokuSettingsView } from '@/views/SudokuSettingsView/SudokuSettingsView'
import { SudokuStatsView } from '@/views/SudokuStatsView/SudokuStatsView'

export function SudokuView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <SudokuGameView key={id} id={Number(id)} />
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
  return <SudokuHomeView />
}
