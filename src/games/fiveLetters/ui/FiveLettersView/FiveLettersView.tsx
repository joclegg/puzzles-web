import { SCREEN } from '@/shared/lib/route.constants'
import { FiveLettersDailyView } from '@/games/fiveLetters/ui/FiveLettersDailyView/FiveLettersDailyView'
import { FiveLettersGameView } from '@/games/fiveLetters/ui/FiveLettersGameView/FiveLettersGameView'
import { FiveLettersHomeView } from '@/games/fiveLetters/ui/FiveLettersHomeView/FiveLettersHomeView'
import { FiveLettersSettingsView } from '@/games/fiveLetters/ui/FiveLettersSettingsView/FiveLettersSettingsView'
import { FiveLettersStatsView } from '@/games/fiveLetters/ui/FiveLettersStatsView/FiveLettersStatsView'

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
  if (screen === SCREEN.DAILY) {
    return <FiveLettersDailyView />
  }
  if (screen === SCREEN.SETTINGS) {
    return <FiveLettersSettingsView />
  }
  return <FiveLettersHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
