import { test } from '@e2e/playwrightExtensions'

const DRAW_ONE_DOWN = '733151820757464953'

test('suggests a move', async ({ solitairePage, assistsPage }) => {
  await solitairePage.useBank({
    path: 'solitaire/drawOne_down.txt',
    lines: [DRAW_ONE_DOWN],
  })
  await solitairePage.openDaily()

  await assistsPage.hint()

  await assistsPage.expectStatus(/^(Move the .+|.*draw from the stock)\.$/)
})
