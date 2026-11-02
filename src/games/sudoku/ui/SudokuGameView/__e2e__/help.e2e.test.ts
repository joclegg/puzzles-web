import { expect, test } from '@e2e/playwrightExtensions'

test('points at a cell that can be filled and says why', async ({
  sudokuPage,
  assistsPage,
}) => {
  await sudokuPage.openDaily()

  await assistsPage.hint()

  await assistsPage.expectStatus(/Only \d fits here|can only go here/)
})

test('walks through the controls', async ({ sudokuPage, assistsPage }) => {
  await sudokuPage.openDaily()

  await assistsPage.startWalkthrough()
  await assistsPage.expectStep('Tap a cell')
  await assistsPage.nextStep()

  await assistsPage.expectStep('tap a number')
  await expect(assistsPage.walkthrough).toContainText('Step 2 of 4')
})
