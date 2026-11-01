import { expect, test } from '@e2e/playwrightExtensions'

test.use({ helpers: false })

test('starts a new player with the helpers off', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)

  await expect(twoTonePage.hintButton).toBeHidden()
})

test('links to the settings to customise helpers', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)

  await twoTonePage.customiseHelpers()

  await twoTonePage.expectOnSettings()
})
