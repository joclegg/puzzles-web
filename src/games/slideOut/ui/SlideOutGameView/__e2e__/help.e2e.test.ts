import { expect, test } from '@e2e/playwrightExtensions'

test('shows the solution and ends the puzzle', async ({
  slideOutPage,
  assistsPage,
}) => {
  await slideOutPage.openDaily('Beginner')

  await assistsPage.showSolution()

  await expect(assistsPage.hintButton).toBeDisabled()
})
