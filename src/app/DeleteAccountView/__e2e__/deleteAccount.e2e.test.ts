import { expect, test } from '@e2e/playwrightExtensions'

test('explains how to delete an account', async ({ legalPage }) => {
  await legalPage.openDeleteAccount()

  await legalPage.expectText('Deletion is immediate and permanent.')
  await legalPage.expectText('choose Delete account')
})

test('offers sign-in when signed out', async ({ legalPage }) => {
  await legalPage.openDeleteAccount()

  await legalPage.button('Sign in to sync').click()

  await expect(legalPage.dialog).toBeVisible()
})

test('opens from settings', async ({ launcherPage, legalPage }) => {
  await launcherPage.openSettings()

  await legalPage.follow('Delete your account')

  await expect(legalPage.deleteHeading).toBeVisible()
})

test('goes back to the launcher', async ({ legalPage, launcherPage }) => {
  await legalPage.openDeleteAccount()

  await legalPage.back()

  await expect(launcherPage.heading).toBeVisible()
})
