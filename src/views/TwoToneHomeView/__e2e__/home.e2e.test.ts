import { expect, test } from '@e2e/playwrightExtensions'

test('shows the sizes and today’s puzzles', async ({ twoTonePage }) => {
  await expect(
    twoTonePage.page.getByRole('button', { name: 'Daily 4 x 4' }),
  ).toBeVisible()
})

test('starts a new puzzle of a size', async ({ twoTonePage }) => {
  await twoTonePage.startSize(6)

  await expect(twoTonePage.tile({ row: 6, column: 6 })).toBeVisible()
})

test('paints with a picked colour', async ({ twoTonePage }) => {
  await twoTonePage.openFromHome('Settings')
  await twoTonePage.chooseInputMode('Pick a colour')
  await twoTonePage.back()
  await twoTonePage.openDaily(4)

  await twoTonePage.pickColour('Blue')
  await twoTonePage.tapTile({ row: 1, column: 1 })

  await twoTonePage.expectTile({ row: 1, column: 1, state: /, blue/ })
})

test('switches to Pick a colour from the game header', async ({
  twoTonePage,
}) => {
  await twoTonePage.openDaily(4)
  await expect(twoTonePage.colourToggle).toHaveAccessibleName('Tap to cycle')

  await twoTonePage.colourToggle.click()
  await twoTonePage.pickColour('Blue')
  await twoTonePage.tapTile({ row: 1, column: 1 })

  await expect(twoTonePage.colourToggle).toHaveAccessibleName('Pick a colour')
  await twoTonePage.expectTile({ row: 1, column: 1, state: /, blue/ })
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

test('offers to resume a puzzle of a size in progress', async ({
  twoTonePage,
}) => {
  await twoTonePage.startSize(6)
  await twoTonePage.back()
  await expect(twoTonePage.sizeTile(6)).toContainText('In progress')

  await twoTonePage.tapSize(6)
  await twoTonePage.answerResume('Resume')

  await expect(twoTonePage.tile({ row: 6, column: 6 })).toBeVisible()
})
