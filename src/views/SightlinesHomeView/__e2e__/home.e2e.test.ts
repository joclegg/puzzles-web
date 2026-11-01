import { expect, test } from '@e2e/playwrightExtensions'

test('shows the sizes and today’s puzzles', async ({ sightlinesPage }) => {
  await sightlinesPage.expectScreenshot('home')
})

test('starts a new puzzle of a size', async ({ sightlinesPage }) => {
  await sightlinesPage.startSize(9)

  await expect(sightlinesPage.dot({ row: 9, column: 9 })).toBeVisible()
})

test('fills by tapping, with no colour toggle', async ({ sightlinesPage }) => {
  await sightlinesPage.openDaily(4)

  await expect(sightlinesPage.colourToggle).toBeHidden()
})

test('counts a solved puzzle in the stats', async ({ sightlinesPage }) => {
  await sightlinesPage.openDaily(4)
  await sightlinesPage.fillDots({
    givens: '..X...X.44.24..X',
    solution: 'BBRBBBRBBBRBBBRR',
  })
  await sightlinesPage.closeDialog()
  await sightlinesPage.back()

  await sightlinesPage.openFromHome('Stats')

  await sightlinesPage.expectStatsRow({ size: 4, text: /4 x 41 ?1/ })
})
