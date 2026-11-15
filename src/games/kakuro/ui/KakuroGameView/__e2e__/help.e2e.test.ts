import { expect, test } from '@e2e/playwrightExtensions'

const BANK_6 = '6;000000001200098700015623000512000130;13'

test('shows the solution and ends the puzzle', async ({
  kakuroPage,
  assistsPage,
}) => {
  await kakuroPage.useBank({ path: 'kakuro/6.txt', lines: [BANK_6] })
  await kakuroPage.openDaily(6)

  await assistsPage.showSolution()

  await expect(assistsPage.hintButton).toBeDisabled()
})

test('hides the hint button when hints are off', async ({
  kakuroPage,
  assistsPage,
}) => {
  await kakuroPage.useBank({ path: 'kakuro/6.txt', lines: [BANK_6] })
  await kakuroPage.openSettings()
  await kakuroPage.toggleSetting('Hints')
  await kakuroPage.back()

  await kakuroPage.openDaily(6)

  await expect(assistsPage.hintButton).toBeHidden()
})
