import { expect, test } from '@e2e/playwrightExtensions'

test('lists the games', async ({ launcherPage }) => {
  await expect(launcherPage.gameLink('Five Letters')).toBeVisible()
  await launcherPage.expectScreenshot('launcher')
})

test('opens a game and comes back', async ({ launcherPage }) => {
  await launcherPage.openGame('Five Letters')
  await launcherPage.back()

  await expect(launcherPage.heading).toBeVisible()
})
