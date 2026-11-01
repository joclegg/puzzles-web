import { SCREEN } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { KakuroDailyView } from '@/views/KakuroDailyView/KakuroDailyView'
import { KakuroGameView } from '@/views/KakuroGameView/KakuroGameView'
import { KakuroHistoryView } from '@/views/KakuroHistoryView/KakuroHistoryView'
import { KakuroHomeView } from '@/views/KakuroHomeView/KakuroHomeView'
import { KakuroSettingsView } from '@/views/KakuroSettingsView/KakuroSettingsView'
import { KakuroStatsView } from '@/views/KakuroStatsView/KakuroStatsView'

export function KakuroView({
  screen,
  id,
  account,
}: {
  screen: string
  id: string
  account: Account
}) {
  if (screen === SCREEN.GAME) {
    return <KakuroGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <KakuroStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <KakuroHistoryView />
  }
  if (screen === SCREEN.DAILY) {
    return <KakuroDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <KakuroSettingsView account={account} />
  }
  return <KakuroHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
