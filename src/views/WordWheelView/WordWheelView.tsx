import { SCREEN } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { WordWheelDailyView } from '@/views/WordWheelDailyView/WordWheelDailyView'
import { WordWheelGameView } from '@/views/WordWheelGameView/WordWheelGameView'
import { WordWheelHistoryView } from '@/views/WordWheelHistoryView/WordWheelHistoryView'
import { WordWheelHomeView } from '@/views/WordWheelHomeView/WordWheelHomeView'
import { WordWheelSettingsView } from '@/views/WordWheelSettingsView/WordWheelSettingsView'
import { WordWheelStatsView } from '@/views/WordWheelStatsView/WordWheelStatsView'

export function WordWheelView({
  screen,
  id,
  account,
}: {
  screen: string
  id: string
  account: Account
}) {
  if (screen === SCREEN.GAME) {
    return <WordWheelGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <WordWheelStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <WordWheelHistoryView />
  }
  if (screen === SCREEN.DAILY) {
    return <WordWheelDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <WordWheelSettingsView account={account} />
  }
  return <WordWheelHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
