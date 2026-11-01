import { SCREEN } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { TwoToneDailyView } from '@/views/TwoToneDailyView/TwoToneDailyView'
import { TwoToneGameView } from '@/views/TwoToneGameView/TwoToneGameView'
import { TwoToneHistoryView } from '@/views/TwoToneHistoryView/TwoToneHistoryView'
import { TwoToneHomeView } from '@/views/TwoToneHomeView/TwoToneHomeView'
import { TwoToneSettingsView } from '@/views/TwoToneSettingsView/TwoToneSettingsView'
import { TwoToneStatsView } from '@/views/TwoToneStatsView/TwoToneStatsView'

export function TwoToneView({
  screen,
  id,
  account,
}: {
  screen: string
  id: string
  account: Account
}) {
  if (screen === SCREEN.GAME) {
    return <TwoToneGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <TwoToneStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <TwoToneHistoryView />
  }
  if (screen === SCREEN.DAILY) {
    return <TwoToneDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <TwoToneSettingsView account={account} />
  }
  return <TwoToneHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
