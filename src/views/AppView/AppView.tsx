import { Suspense } from 'react'

import { gameById } from '@/common/game.functions'
import { LAUNCHER_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import type { SignInProvider } from '@/common/sync.types'
import { useSync } from '@/common/sync.hooks'
import { AllHistoryView } from '@/views/AllHistoryView/AllHistoryView'
import { GeneralSettingsView } from '@/views/GeneralSettingsView/GeneralSettingsView'
import { LauncherView } from '@/views/LauncherView/LauncherView'

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
  const definition = gameById(game)
  if (definition) {
    return (
      <Suspense fallback={null}>
        <definition.View screen={screen} id={id} />
      </Suspense>
    )
  }
  if (game === LAUNCHER_ROUTE.SETTINGS) {
    return <GeneralSettingsView account={account} />
  }
  if (game === LAUNCHER_ROUTE.HISTORY) {
    return <AllHistoryView />
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
