import { SCREEN } from '@/shared/lib/route.constants'
import { SolitaireDailyView } from '@/games/solitaire/ui/SolitaireDailyView/SolitaireDailyView'
import { SolitaireGameView } from '@/games/solitaire/ui/SolitaireGameView/SolitaireGameView'
import { SolitaireHistoryView } from '@/games/solitaire/ui/SolitaireHistoryView/SolitaireHistoryView'
import { SolitaireHomeView } from '@/games/solitaire/ui/SolitaireHomeView/SolitaireHomeView'
import { SolitaireSettingsView } from '@/games/solitaire/ui/SolitaireSettingsView/SolitaireSettingsView'
import { SolitaireStatsView } from '@/games/solitaire/ui/SolitaireStatsView/SolitaireStatsView'

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
  if (screen === SCREEN.DAILY) {
    return <SolitaireDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <SolitaireSettingsView />
  }
  return <SolitaireHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
