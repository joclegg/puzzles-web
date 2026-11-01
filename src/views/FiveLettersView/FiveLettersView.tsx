import { SCREEN } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { FiveLettersDailyView } from '@/views/FiveLettersDailyView/FiveLettersDailyView'
import { FiveLettersGameView } from '@/views/FiveLettersGameView/FiveLettersGameView'
import { FiveLettersHomeView } from '@/views/FiveLettersHomeView/FiveLettersHomeView'
import { FiveLettersSettingsView } from '@/views/FiveLettersSettingsView/FiveLettersSettingsView'
import { FiveLettersStatsView } from '@/views/FiveLettersStatsView/FiveLettersStatsView'

export function FiveLettersView({
  screen,
  id,
  account,
}: {
  screen: string
  id: string
  account: Account
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
    return <FiveLettersSettingsView account={account} />
  }
  return <FiveLettersHomeView play={screen === SCREEN.PLAY ? id : undefined} />
}
