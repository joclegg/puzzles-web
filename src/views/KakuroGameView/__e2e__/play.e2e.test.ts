import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_6 = {
  solution: '000000001200098700015623000512000130',
  givens: [13],
}

test('solves the daily 6 x 6 puzzle', async ({ kakuroPage }) => {
  await kakuroPage.openDaily(6)

  await kakuroPage.solve(DAILY_6)

  await expect(kakuroPage.dialog).toContainText('Solved!')
})

test('places a digit, undoes and redoes it', async ({ kakuroPage }) => {
  await kakuroPage.openDaily(6)

  await kakuroPage.enter({ row: 2, column: 3, digit: 1 })
  await kakuroPage.undo()
  await kakuroPage.expectCell({ row: 2, column: 3, state: /, empty/ })
  await kakuroPage.redo()

  await kakuroPage.expectCell({ row: 2, column: 3, state: /, 1/ })
})

test('shows a wrong digit', async ({ kakuroPage }) => {
  await kakuroPage.openDaily(6)

  await kakuroPage.enter({ row: 2, column: 3, digit: 9 })

  await kakuroPage.expectCell({ row: 2, column: 3, state: /wrong/ })
  await kakuroPage.expectScreenshot('wrong-digit')
})

test('pencils in notes', async ({ kakuroPage }) => {
  await kakuroPage.openDaily(6)
  await kakuroPage.tapCell({ row: 2, column: 3 })

  await kakuroPage.tool(/^Notes are off/)
  await kakuroPage.tapDigit(1)
  await kakuroPage.tapDigit(2)

  await kakuroPage.expectCell({ row: 2, column: 3, state: /, empty/ })
})

test('lists the sums that fit with the sum helper on', async ({
  kakuroPage,
}) => {
  await kakuroPage.openSettings()
  await kakuroPage.toggleSetting('Sum helper')
  await kakuroPage.back()
  await kakuroPage.openDaily(6)

  await kakuroPage.tapCell({ row: 2, column: 3 })

  await expect(kakuroPage.combinations).toContainText('Across 3 in 2: 12')
})

test('fills cells number first', async ({ kakuroPage }) => {
  await kakuroPage.openSettings()
  await kakuroPage.chooseOption('Number first')
  await kakuroPage.back()
  await kakuroPage.openDaily(6)

  await kakuroPage.tapDigit(2)
  await kakuroPage.tapCell({ row: 2, column: 4 })

  await kakuroPage.expectCell({ row: 2, column: 4, state: /, 2/ })
})

test('keeps progress after a reload', async ({ kakuroPage }) => {
  await kakuroPage.openDaily(6)
  await kakuroPage.enter({ row: 2, column: 3, digit: 1 })

  await kakuroPage.reload()

  await kakuroPage.expectCell({ row: 2, column: 3, state: /, 1/ })
})
