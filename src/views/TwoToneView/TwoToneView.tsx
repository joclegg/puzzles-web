import { SCREEN } from '@/common/route.constants'
import { TwoToneGameView } from '@/views/TwoToneGameView/TwoToneGameView'
import { TwoToneHistoryView } from '@/views/TwoToneHistoryView/TwoToneHistoryView'
import { TwoToneHomeView } from '@/views/TwoToneHomeView/TwoToneHomeView'
import { TwoToneSettingsView } from '@/views/TwoToneSettingsView/TwoToneSettingsView'
import { TwoToneStatsView } from '@/views/TwoToneStatsView/TwoToneStatsView'

export function TwoToneView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <TwoToneGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <TwoToneStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <TwoToneHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <TwoToneSettingsView />
  }
  return <TwoToneHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
