import { test } from '@e2e/playwrightExtensions'

test('suggests a move', async ({ solitairePage, assistsPage }) => {
  await solitairePage.openDaily()

  await assistsPage.hint()

  await assistsPage.expectStatus(/^(Move the .+|Draw from the stock)\.$/)
})
