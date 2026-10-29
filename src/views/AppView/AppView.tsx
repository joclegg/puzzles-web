import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import { useSync } from '@/common/sync.hooks'
import { FiveLettersView } from '@/views/FiveLettersView/FiveLettersView'
import { KakuroView } from '@/views/KakuroView/KakuroView'
import { LauncherView } from '@/views/LauncherView/LauncherView'
import { SlideOutView } from '@/views/SlideOutView/SlideOutView'
import { SolitaireView } from '@/views/SolitaireView/SolitaireView'
import { SightlinesView } from '@/views/SightlinesView/SightlinesView'
import { SudokuView } from '@/views/SudokuView/SudokuView'
import { TwoToneView } from '@/views/TwoToneView/TwoToneView'
import { WordWheelView } from '@/views/WordWheelView/WordWheelView'

export function AppView() {
  const { user, signIn, signOut } = useSync()
  const [game, screen = SCREEN.HOME, id = ''] = useRoute()

  return routeView({
    game,
    screen,
    id,
    email: user?.email ?? null,
    onSignIn: signIn,
    onSignOut: signOut,
  })
}

function routeView({
  game,
  screen,
  id,
  email,
  onSignIn,
  onSignOut,
}: {
  game: string | undefined
  screen: string
  id: string
  email: string | null
  onSignIn: () => void
  onSignOut: () => void
}) {
  if (game === GAME_ROUTE.FIVE_LETTERS) {
    return <FiveLettersView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.TWO_TONE) {
    return <TwoToneView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SIGHTLINES) {
    return <SightlinesView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.KAKURO) {
    return <KakuroView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SLIDE_OUT) {
    return <SlideOutView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.WORD_WHEEL) {
    return <WordWheelView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SOLITAIRE) {
    return <SolitaireView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SUDOKU) {
    return <SudokuView screen={screen} id={id} />
  }
  return (
    <LauncherView email={email} onSignIn={onSignIn} onSignOut={onSignOut} />
  )
}
