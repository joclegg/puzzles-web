import { SCREEN } from '@/common/route.constants'
import { WordWheelGameView } from '@/views/WordWheelGameView/WordWheelGameView'
import { WordWheelHistoryView } from '@/views/WordWheelHistoryView/WordWheelHistoryView'
import { WordWheelHomeView } from '@/views/WordWheelHomeView/WordWheelHomeView'
import { WordWheelSettingsView } from '@/views/WordWheelSettingsView/WordWheelSettingsView'
import { WordWheelStatsView } from '@/views/WordWheelStatsView/WordWheelStatsView'

export function WordWheelView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <WordWheelGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <WordWheelStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <WordWheelHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <WordWheelSettingsView />
  }
  return <WordWheelHomeView />
}
