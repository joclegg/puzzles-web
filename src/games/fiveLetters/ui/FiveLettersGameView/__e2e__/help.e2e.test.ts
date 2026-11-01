import { expect, test } from '@e2e/playwrightExtensions'

test('gives away one letter as a hint', async ({
  fiveLettersPage,
  assistsPage,
}) => {
  await fiveLettersPage.openDaily()

  await assistsPage.hint()

  await assistsPage.expectStatus(/^Letter \d is [A-Z]\.$/)
})

test('shows the word when asked', async ({ fiveLettersPage, assistsPage }) => {
  await fiveLettersPage.openDaily()

  await assistsPage.showSolution('Show the word')

  await expect(fiveLettersPage.dialog).toContainText('The word was')
})
