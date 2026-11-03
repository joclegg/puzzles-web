import { expect, test } from '@e2e/playwrightExtensions'

test('shows the privacy policy', async ({ legalPage }) => {
  await legalPage.openPrivacy()

  await legalPage.expectText('Last updated: 2 November 2026')
  await expect(
    legalPage.link('github.com/joclegg/puzzles-web/issues'),
  ).toHaveAttribute('href', 'https://github.com/joclegg/puzzles-web/issues')
})

test('opens the privacy policy from settings', async ({
  launcherPage,
  legalPage,
}) => {
  await launcherPage.openSettings()

  await legalPage.follow('Privacy policy')

  await expect(legalPage.privacyHeading).toBeVisible()
})

test('links to account deletion', async ({ legalPage }) => {
  await legalPage.openPrivacy()

  await legalPage.follow('delete account')

  await expect(legalPage.deleteHeading).toBeVisible()
})

test('goes back to the launcher', async ({ legalPage, launcherPage }) => {
  await legalPage.openPrivacy()

  await legalPage.back()

  await expect(launcherPage.heading).toBeVisible()
})
