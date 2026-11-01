import { SCREEN } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { SlideOutDailyView } from '@/views/SlideOutDailyView/SlideOutDailyView'
import { SlideOutGameView } from '@/views/SlideOutGameView/SlideOutGameView'
import { SlideOutHistoryView } from '@/views/SlideOutHistoryView/SlideOutHistoryView'
import { SlideOutHomeView } from '@/views/SlideOutHomeView/SlideOutHomeView'
import { SlideOutSettingsView } from '@/views/SlideOutSettingsView/SlideOutSettingsView'
import { SlideOutStatsView } from '@/views/SlideOutStatsView/SlideOutStatsView'

export function SlideOutView({
  screen,
  id,
  account,
}: {
  screen: string
  id: string
  account: Account
}) {
  if (screen === SCREEN.GAME) {
    return <SlideOutGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <SlideOutStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <SlideOutHistoryView />
  }
  if (screen === SCREEN.DAILY) {
    return <SlideOutDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SlideOutSettingsView account={account} />
  }
  return <SlideOutHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
