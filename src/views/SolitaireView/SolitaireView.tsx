import { SCREEN } from '@/common/route.constants'
import { SolitaireGameView } from '@/views/SolitaireGameView/SolitaireGameView'
import { SolitaireHistoryView } from '@/views/SolitaireHistoryView/SolitaireHistoryView'
import { SolitaireHomeView } from '@/views/SolitaireHomeView/SolitaireHomeView'
import { SolitaireSettingsView } from '@/views/SolitaireSettingsView/SolitaireSettingsView'
import { SolitaireStatsView } from '@/views/SolitaireStatsView/SolitaireStatsView'

export function SolitaireView({ screen, id }: { screen: string; id: string }) {
  if (screen === SCREEN.GAME) {
    return <SolitaireGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <SolitaireStatsView />
  }
  if (screen === SCREEN.HISTORY) {
    return <SolitaireHistoryView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SolitaireSettingsView />
  }
  return <SolitaireHomeView />
}
