import { GAME_ROUTE, LAUNCHER_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import type { SignInProvider } from '@/common/sync.types'
import { useSync } from '@/common/sync.hooks'
import { AllHistoryView } from '@/views/AllHistoryView/AllHistoryView'
import { GeneralSettingsView } from '@/views/GeneralSettingsView/GeneralSettingsView'
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
  const {
    user,
    signIn,
    sendEmailLink,
    verifyEmailCode,
    signOut,
    deleteAccount,
  } = useSync()
  const [game, screen = SCREEN.HOME, id = ''] = useRoute()

  return routeView({
    game,
    screen,
    id,
    email: user?.email ?? null,
    onSignIn: signIn,
    onSendEmailLink: sendEmailLink,
    onVerifyEmailCode: verifyEmailCode,
    onSignOut: signOut,
    onDeleteAccount: deleteAccount,
  })
}

function routeView({
  game,
  screen,
  id,
  email,
  onSignIn,
  onSendEmailLink,
  onVerifyEmailCode,
  onSignOut,
  onDeleteAccount,
}: {
  game: string | undefined
  screen: string
  id: string
  email: string | null
  onSignIn: (provider: SignInProvider) => void
  onSendEmailLink: (email: string) => Promise<boolean>
  onVerifyEmailCode: (entry: {
    email: string
    code: string
  }) => Promise<boolean>
  onSignOut: () => void
  onDeleteAccount: () => Promise<boolean>
}) {
  const account = { email, onDeleteAccount }
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
  if (game === LAUNCHER_ROUTE.SETTINGS) {
    return <GeneralSettingsView account={account} />
  }
  if (game === LAUNCHER_ROUTE.HISTORY) {
    return <AllHistoryView />
  }
  if (game === GAME_ROUTE.SUDOKU) {
    return <SudokuView screen={screen} id={id} />
  }
  return (
    <LauncherView
      email={email}
      onSignIn={onSignIn}
      onSendEmailLink={onSendEmailLink}
      onVerifyEmailCode={onVerifyEmailCode}
      onSignOut={onSignOut}
    />
  )
}
