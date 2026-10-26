import { expect, test } from '@e2e/playwrightExtensions'

test('shows the sizes and today’s puzzles', async ({ sightlinesPage }) => {
  await sightlinesPage.expectScreenshot('home')
})

test('starts a new puzzle of a size', async ({ sightlinesPage }) => {
  await sightlinesPage.startSize(9)

  await expect(sightlinesPage.dot({ row: 9, column: 9 })).toBeVisible()
})

test('paints with a picked colour', async ({ sightlinesPage }) => {
  await sightlinesPage.openFromHome('Settings')
  await sightlinesPage.chooseInputMode('Pick a colour')
  await sightlinesPage.back()
  await sightlinesPage.openDaily(4)

  await sightlinesPage.pickColour('Red')
  await sightlinesPage.tapDot({ row: 1, column: 1 })

  await sightlinesPage.expectDot({ row: 1, column: 1, state: /, red/ })
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
