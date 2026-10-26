import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import { FiveLettersView } from '@/views/FiveLettersView/FiveLettersView'
import { LauncherView } from '@/views/LauncherView/LauncherView'
import { SightlinesView } from '@/views/SightlinesView/SightlinesView'
import { TwoToneView } from '@/views/TwoToneView/TwoToneView'

export function AppView() {
  const [game, screen = SCREEN.HOME, id = ''] = useRoute()

  if (game === GAME_ROUTE.FIVE_LETTERS) {
    return <FiveLettersView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.TWO_TONE) {
    return <TwoToneView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SIGHTLINES) {
    return <SightlinesView screen={screen} id={id} />
  }
  return <LauncherView />
}
