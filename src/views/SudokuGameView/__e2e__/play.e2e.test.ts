import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_CLASSIC = {
  givens:
    '000000784080401060407680000006000007890000056100000300000014502010802030259000000',
  solution:
    '561329784983471265427685913346598127892137456175246398638914572714852639259763841',
}

test('solves the daily classic puzzle', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()
  await sudokuPage.expectScreenshot('daily-classic')

  await sudokuPage.solve(DAILY_CLASSIC)

  await expect(sudokuPage.dialog).toContainText('Solved!')
})

test('shows and counts a wrong number', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()

  await sudokuPage.enter({ row: 1, column: 1, digit: 9 })

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 9, wrong/ })
  await expect(sudokuPage.subtitle).toContainText('Mistakes: 1')
  await sudokuPage.expectScreenshot('wrong-number')
})

test('pencils in notes', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()
  await sudokuPage.cell({ row: 1, column: 1 }).click()

  await sudokuPage.tool(/^Notes off/)
  await sudokuPage.tapDigit(5)
  await sudokuPage.tapDigit(6)

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, empty/ })
  await sudokuPage.expectScreenshot('notes')
})

test('undoes and redoes a number', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()
  await sudokuPage.enter({ row: 1, column: 1, digit: 5 })

  await sudokuPage.undo()
  await sudokuPage.expectCell({ row: 1, column: 1, state: /, empty/ })
  await sudokuPage.redo()

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 5/ })
})

test('keeps progress after a reload', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()
  await sudokuPage.enter({ row: 1, column: 1, digit: 5 })

  await sudokuPage.reload()

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 5/ })
})

test('draws the cages of the daily killer puzzle', async ({ sudokuPage }) => {
  await sudokuPage.chooseMode('Killer')

  await sudokuPage.openDaily()

  await sudokuPage.expectCell({ row: 6, column: 6, state: /cage 8/ })
  await sudokuPage.expectScreenshot('daily-killer')
})
