import { SCREEN } from '@/common/route.constants'
import { FiveLettersGameView } from '@/views/FiveLettersGameView/FiveLettersGameView'
import { FiveLettersHomeView } from '@/views/FiveLettersHomeView/FiveLettersHomeView'
import { FiveLettersSettingsView } from '@/views/FiveLettersSettingsView/FiveLettersSettingsView'
import { FiveLettersStatsView } from '@/views/FiveLettersStatsView/FiveLettersStatsView'

export function FiveLettersView({
  screen,
  id,
}: {
  screen: string
  id: string
}) {
  if (screen === SCREEN.GAME) {
    return <FiveLettersGameView key={id} id={id} />
  }
  if (screen === SCREEN.STATS) {
    return <FiveLettersStatsView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <FiveLettersSettingsView />
  }
  return <FiveLettersHomeView />
}
