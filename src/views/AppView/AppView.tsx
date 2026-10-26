import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import { FiveLettersGameView } from '@/views/FiveLettersGameView/FiveLettersGameView'
import { FiveLettersHomeView } from '@/views/FiveLettersHomeView/FiveLettersHomeView'
import { FiveLettersSettingsView } from '@/views/FiveLettersSettingsView/FiveLettersSettingsView'
import { FiveLettersStatsView } from '@/views/FiveLettersStatsView/FiveLettersStatsView'
import { LauncherView } from '@/views/LauncherView/LauncherView'

export function AppView() {
  const [game, screen = SCREEN.HOME, id] = useRoute()

  if (game === GAME_ROUTE.FIVE_LETTERS) {
    if (screen === SCREEN.GAME) {
      return <FiveLettersGameView key={id} id={Number(id)} />
    }
    if (screen === SCREEN.STATS) {
      return <FiveLettersStatsView />
    }
    if (screen === SCREEN.SETTINGS) {
      return <FiveLettersSettingsView />
    }
    return <FiveLettersHomeView />
  }
  return <LauncherView />
}
