import { expect, test } from '@e2e/playwrightExtensions'

test('shows the solution and ends the puzzle', async ({
  kakuroPage,
  assistsPage,
}) => {
  await kakuroPage.openDaily(6)

  await assistsPage.showSolution()

  await expect(assistsPage.hintButton).toBeDisabled()
})

test('hides the hint button when hints are off', async ({
  kakuroPage,
  assistsPage,
}) => {
  await kakuroPage.openSettings()
  await kakuroPage.toggleSetting('Hints')
  await kakuroPage.back()

  await kakuroPage.openDaily(6)

  await expect(assistsPage.hintButton).toBeHidden()
})
