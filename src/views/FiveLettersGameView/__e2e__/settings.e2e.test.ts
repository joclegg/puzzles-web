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
  await fiveLettersPage.toggleSetting('High contrast colours')
  await fiveLettersPage.back()
  await fiveLettersPage.openDaily()

  await fiveLettersPage.typeWord('TOPIC')

  await fiveLettersPage.expectScreenshot('high-contrast')
})
