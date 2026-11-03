import { CONTACT_URL, LAUNCHER_ROUTE } from '@/shared/lib/route.constants'
import { routeHash } from '@/shared/lib/route.functions'
import type { Account, SignInProvider } from '@/shared/sync/sync.types'
import { AccountButton } from '@/shared/sync/AccountButton/AccountButton'
import { DeleteAccount } from '@/shared/sync/DeleteAccount/DeleteAccount'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function DeleteAccountView({
  account,
  onSignIn,
  onSendEmailLink,
  onVerifyEmailCode,
  onSignOut,
}: {
  account: Account
  onSignIn: (provider: SignInProvider) => void
  onSendEmailLink: (email: string) => Promise<boolean>
  onVerifyEmailCode: (entry: {
    email: string
    code: string
  }) => Promise<boolean>
  onSignOut: () => void
}) {
  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="Delete your account" back={[]} />
      <article className="grid gap-4 pb-8 text-sm leading-relaxed">
        <p>
          You can delete your Puzzles account at any time. Deleting it removes
          your account and the saved games and settings synced to it. Deletion
          is immediate and permanent.
        </p>
        <p>
          Games and settings saved on your devices stay there until you remove
          the app or clear its data.
        </p>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">In the apps</h2>
          <p>
            On Android, iOS or the web, open Settings, go to your account and
            choose Delete account.
          </p>
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">On this page</h2>
          {account.email === null ? (
            <>
              <p>Sign in with the account you want to delete.</p>
              <div>
                <AccountButton
                  email={account.email}
                  onSignIn={onSignIn}
                  onSendEmailLink={onSendEmailLink}
                  onVerifyEmailCode={onVerifyEmailCode}
                  onSignOut={onSignOut}
                />
              </div>
            </>
          ) : (
            <>
              <p>Signed in as {account.email}.</p>
              <DeleteAccount onDeleteAccount={account.onDeleteAccount} />
            </>
          )}
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">Can&apos;t sign in?</h2>
          <p>
            Open an issue at{' '}
            <a className="underline" href={CONTACT_URL}>
              github.com/joclegg/puzzles-web/issues
            </a>{' '}
            and we will help. See the{' '}
            <a className="underline" href={routeHash([LAUNCHER_ROUTE.PRIVACY])}>
              privacy policy
            </a>{' '}
            for what we store.
          </p>
        </section>
      </article>
    </MenuScreen>
  )
}
