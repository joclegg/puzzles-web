import { SCREEN } from '@/common/route.constants'
import { SlideOutGameView } from '@/views/SlideOutGameView/SlideOutGameView'
import { SlideOutHistoryView } from '@/views/SlideOutHistoryView/SlideOutHistoryView'
import { SlideOutHomeView } from '@/views/SlideOutHomeView/SlideOutHomeView'
import { SlideOutSettingsView } from '@/views/SlideOutSettingsView/SlideOutSettingsView'
import { SlideOutStatsView } from '@/views/SlideOutStatsView/SlideOutStatsView'

export function SlideOutView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <SlideOutGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <SlideOutStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <SlideOutHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SlideOutSettingsView />
  }
  return <SlideOutHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
