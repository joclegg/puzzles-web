import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_CLASSIC = {
  givens:
    '009031057000600042050000000560970400090000020001064039000000090910006000730850100',
  solution:
    '629431857178695342354728916563972481497183625281564739846217593915346278732859164',
}

test('solves the daily classic puzzle', async ({ sudokuPage }) => {
  await sudokuPage.openDaily()

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

  await sudokuPage.expectCell({ row: 1, column: 1, state: /cage \d+/ })
})

test('offers only this mode’s dailies and a new puzzle of this level', async ({
  sudokuPage,
}) => {
  await sudokuPage.openDaily()
  await sudokuPage.solve(DAILY_CLASSIC)

  await expect(sudokuPage.winTile('Daily Expert')).toBeVisible()
  await expect(sudokuPage.winTile('Daily Medium')).toBeHidden()
  await expect(sudokuPage.winTile('Daily Evil')).toBeHidden()

  await sudokuPage.winTile('New Medium').click()

  await expect(sudokuPage.dialog).toBeHidden()
  await expect(sudokuPage.title).toHaveText('Classic · Medium')
})
