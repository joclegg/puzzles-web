import { expect, test } from '@e2e/playwrightExtensions'

test('starts hard mode games once it is turned on', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.openSettings()
  await fiveLettersPage.toggleSetting('Hard mode')
  await fiveLettersPage.back()

  await fiveLettersPage.openDaily()

  await expect(fiveLettersPage.hardModeLabel).toBeVisible()
})

test('switches to high contrast colours', async ({ fiveLettersPage }) => {
  await fiveLettersPage.openSettings()
  await fiveLettersPage.toggleSetting('High contrast')
  await fiveLettersPage.back()
  await fiveLettersPage.openDaily()

  await fiveLettersPage.typeWord('TOPIC')

  await fiveLettersPage.expectScreenshot('high-contrast')
})

test('plays the New York Times word when it is turned on', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.fakeNytWord('geeky')
  await fiveLettersPage.openSettings()
  await fiveLettersPage.toggleSetting('New York Times')
  await fiveLettersPage.back()
  await fiveLettersPage.openDaily()

  await fiveLettersPage.typeWord('GEEKY')

  await expect(fiveLettersPage.dialog).toContainText('Got it in 1!')
})
