import { CONTACT_URL, LAUNCHER_ROUTE } from '@/shared/lib/route.constants'
import { routeHash } from '@/shared/lib/route.functions'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function PrivacyView() {
  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="Privacy policy" back={[]} />
      <article className="grid gap-4 pb-8 text-sm leading-relaxed">
        <p className="text-muted-foreground">Last updated: 2 November 2026</p>
        <p>
          This policy covers Puzzles, the Android, iOS and web apps by Jo Clegg.
        </p>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">The short version</h2>
          <p>
            Every game works offline and without an account. There are no
            analytics, no ads and no tracking. Your games and settings stay on
            your device unless you choose to sign in to sync them.
          </p>
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">If you sign in</h2>
          <p>
            Signing in is optional. You can sign in with Google, Microsoft,
            Apple or a link sent to your email, to sync your saved games and
            settings between devices through Supabase. When you are signed in we
            store:
          </p>
          <ul className="list-disc pl-5">
            <li>your email address</li>
            <li>your account user ID</li>
            <li>your saved games and game settings</li>
          </ul>
          <p>
            This is used only to sync your games and settings. It is encrypted
            in transit over HTTPS. It is not sold or shared with anyone, except
            Supabase, which stores it for us, and the sign-in provider you
            choose.
          </p>
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">Downloads</h2>
          <p>
            The apps download puzzle banks from joclegg.github.io, hosted on
            GitHub Pages, which may log your IP address like any web host. The
            Five Letters Daily puzzle 2 fetches the day&apos;s word from
            puzzles-daily.joclegg.dev. Neither request includes any personal
            data.
          </p>
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">Deleting your data</h2>
          <p>
            You can delete your account and all synced data at any time, in the
            app&apos;s settings or on the{' '}
            <a
              className="underline"
              href={routeHash([LAUNCHER_ROUTE.DELETE_ACCOUNT])}
            >
              delete account
            </a>{' '}
            page. Deletion is immediate. Data saved on your devices stays there
            until you remove the app or clear its data.
          </p>
        </section>
        <section className="grid gap-2">
          <h2 className="text-base font-semibold">Contact</h2>
          <p>
            Questions about privacy? Open an issue at{' '}
            <a className="underline" href={CONTACT_URL}>
              github.com/joclegg/puzzles-web/issues
            </a>
            .
          </p>
        </section>
      </article>
    </MenuScreen>
  )
}
