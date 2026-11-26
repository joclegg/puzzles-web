import { expect, test } from '@e2e/playwrightExtensions'

test('links to the App Store', async ({ launcherPage }) => {
  await expect(launcherPage.appStoreLink).toBeVisible()
})

test.describe('on an iPhone', () => {
  test.use({
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  })

  test('suggests the app once', async ({ launcherPage }) => {
    await expect(launcherPage.appPrompt).toBeVisible()

    await launcherPage.keepPlayingHere()
    await launcherPage.page.reload()

    await expect(launcherPage.heading).toBeVisible()
    await expect(launcherPage.appPrompt).toBeHidden()
  })
})
