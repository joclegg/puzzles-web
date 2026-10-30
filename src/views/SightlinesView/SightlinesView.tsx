import { SCREEN } from '@/common/route.constants'
import { SightlinesGameView } from '@/views/SightlinesGameView/SightlinesGameView'
import { SightlinesHistoryView } from '@/views/SightlinesHistoryView/SightlinesHistoryView'
import { SightlinesHomeView } from '@/views/SightlinesHomeView/SightlinesHomeView'
import { SightlinesSettingsView } from '@/views/SightlinesSettingsView/SightlinesSettingsView'
import { SightlinesStatsView } from '@/views/SightlinesStatsView/SightlinesStatsView'

export function SightlinesView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <SightlinesGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <SightlinesStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <SightlinesHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SightlinesSettingsView />
  }
  return <SightlinesHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
