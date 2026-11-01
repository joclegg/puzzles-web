import { Suspense } from 'react'

import { gameById } from '@/shared/game/game.functions'
import { LAUNCHER_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { useRoute } from '@/shared/lib/route.hooks'
import type { SignInProvider } from '@/shared/sync/sync.types'
import { useSync } from '@/shared/sync/sync.hooks'
import { AllHistoryView } from '@/app/AllHistoryView/AllHistoryView'
import { GeneralSettingsView } from '@/app/GeneralSettingsView/GeneralSettingsView'
import { LauncherView } from '@/app/LauncherView/LauncherView'

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
