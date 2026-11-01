import { expect, test } from '@e2e/playwrightExtensions'

test('opens the General tab from the launcher', async ({
  launcherPage,
  settingsPage,
}) => {
  await launcherPage.openSettings()

  await settingsPage.expectTab('General')
  await expect(settingsPage.option('Dark')).toBeVisible()
  await settingsPage.expectScreenshot('general')
})

test('switches the theme', async ({ launcherPage, settingsPage }) => {
  await launcherPage.openSettings()

  await settingsPage.choose('Dark')

  await settingsPage.expectOption('Dark')
})

test('goes back to the launcher', async ({ launcherPage, settingsPage }) => {
  await launcherPage.openSettings()

  await settingsPage.back()

  await expect(launcherPage.heading).toBeVisible()
})

test('switches from a game tab to General', async ({ settingsPage }) => {
  await settingsPage.open('kakuro')
  await settingsPage.expectTab('Kakuro')

  await settingsPage.openTab('General')

  await expect(settingsPage.option('Dark')).toBeVisible()
})
