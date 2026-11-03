import { Suspense } from 'react'

import { gameById } from '@/shared/game/game.functions'
import { LAUNCHER_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { useRoute } from '@/shared/lib/route.hooks'
import type { SignInProvider } from '@/shared/sync/sync.types'
import { useSync } from '@/shared/sync/sync.hooks'
import { AllHistoryView } from '@/app/AllHistoryView/AllHistoryView'
import { DeleteAccountView } from '@/app/DeleteAccountView/DeleteAccountView'
import { GeneralSettingsView } from '@/app/GeneralSettingsView/GeneralSettingsView'
import { LauncherView } from '@/app/LauncherView/LauncherView'
import { PrivacyView } from '@/app/PrivacyView/PrivacyView'

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
        <definition.View
          key={screen === SCREEN.GAME ? `${SCREEN.GAME}/${id}` : SCREEN.HOME}
          screen={screen}
          id={id}
        />
      </Suspense>
    )
  }
  if (game === LAUNCHER_ROUTE.SETTINGS) {
    return <GeneralSettingsView account={account} />
  }
  if (game === LAUNCHER_ROUTE.HISTORY) {
    return <AllHistoryView />
  }
  if (game === LAUNCHER_ROUTE.PRIVACY) {
    return <PrivacyView />
  }
  if (game === LAUNCHER_ROUTE.DELETE_ACCOUNT) {
    return (
      <DeleteAccountView
        account={account}
        onSignIn={onSignIn}
        onSendEmailLink={onSendEmailLink}
        onVerifyEmailCode={onVerifyEmailCode}
        onSignOut={onSignOut}
      />
    )
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
