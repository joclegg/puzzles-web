import { SCREEN } from '@/common/route.constants'
import { KakuroGameView } from '@/views/KakuroGameView/KakuroGameView'
import { KakuroHistoryView } from '@/views/KakuroHistoryView/KakuroHistoryView'
import { KakuroHomeView } from '@/views/KakuroHomeView/KakuroHomeView'
import { KakuroSettingsView } from '@/views/KakuroSettingsView/KakuroSettingsView'
import { KakuroStatsView } from '@/views/KakuroStatsView/KakuroStatsView'

export function KakuroView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <KakuroGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <KakuroStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <KakuroHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <KakuroSettingsView />
  }
  return <KakuroHomeView />
}
