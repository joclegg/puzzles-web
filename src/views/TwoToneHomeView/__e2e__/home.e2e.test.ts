import { expect, test } from '@e2e/playwrightExtensions'

test('shows the sizes and today’s puzzles', async ({ twoTonePage }) => {
  await twoTonePage.expectScreenshot('home')
})

test('starts a new puzzle of a size', async ({ twoTonePage }) => {
  await twoTonePage.startSize(6)

  await expect(twoTonePage.tile({ row: 6, column: 6 })).toBeVisible()
})

test('fills by tapping, with no colour toggle', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)

  await expect(twoTonePage.colourToggle).toBeHidden()
})

test('counts a solved puzzle in the stats', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)
  await twoTonePage.fillTiles({
    givens: '...B..RB.B....R.',
    solution: 'RRBBBRRBRBBRBBRR',
  })
  await twoTonePage.closeDialog()
  await twoTonePage.back()

  await twoTonePage.openFromHome('Stats')

  await twoTonePage.expectStatsRow({ size: 4, text: /4 x 41 ?1/ })
})
