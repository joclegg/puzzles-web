import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_4 = { givens: '...B..RB.B....R.', solution: 'RRBBBRRBRBBRBBRR' }

test('solves the daily 4 x 4 puzzle', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)
  await twoTonePage.expectScreenshot('daily-start')

  await twoTonePage.fillTiles(DAILY_4)

  await expect(twoTonePage.dialog).toContainText('Solved!')
  await twoTonePage.expectScreenshot('daily-solved')
})

test('cycles a tile through red, blue and empty and undoes it', async ({
  twoTonePage,
}) => {
  await twoTonePage.openDaily(4)

  await twoTonePage.tapTile({ row: 1, column: 1 })
  await twoTonePage.expectTile({ row: 1, column: 1, state: /, red/ })
  await twoTonePage.tapTile({ row: 1, column: 1 })
  await twoTonePage.expectTile({ row: 1, column: 1, state: /, blue/ })
  await twoTonePage.undo()

  await twoTonePage.expectTile({ row: 1, column: 1, state: /, red/ })
})

test('marks three in a row as breaking a rule', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)

  await twoTonePage.tapTile({ row: 2, column: 1 })
  await twoTonePage.tapTile({ row: 2, column: 2 })

  await twoTonePage.expectTile({ row: 2, column: 3, state: /breaks a rule/ })
  await twoTonePage.expectScreenshot('broken-rule')
})

test('points out a wrong tile as a hint', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)
  await twoTonePage.tapTile({ row: 1, column: 1 })
  await twoTonePage.tapTile({ row: 1, column: 1 })

  await twoTonePage.hint()

  await expect(twoTonePage.hintMessage).toHaveText(
    'This tile is the wrong colour.',
  )
})

test('explains the next step as a hint', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)

  await twoTonePage.hint()

  await expect(twoTonePage.hintMessage).not.toBeEmpty()
  await twoTonePage.expectScreenshot('hint')
})

test('keeps progress after a reload', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(4)
  await twoTonePage.tapTile({ row: 1, column: 1 })

  await twoTonePage.reload()

  await twoTonePage.expectTile({ row: 1, column: 1, state: /, red/ })
})

test('shows the starting tiles only when asked', async ({ twoTonePage }) => {
  await twoTonePage.openDaily(6)
  const toggle = twoTonePage.startingTilesToggle
  await expect(toggle).toHaveAccessibleName('Show the starting tiles')

  await toggle.click()

  await expect(toggle).toHaveAccessibleName('Hide the starting tiles')
  await twoTonePage.expectScreenshot('starting-tiles-shown')
})
