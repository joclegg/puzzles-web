import { expect, test } from '@e2e/playwrightExtensions'

const CLASSIC_MEDIUM =
  '009031057000600042050000000560970400090000020001064039000000090910006000730850100|629431857178695342354728916563972481497183625281564739846217593915346278732859164|'
const KILLER_MEDIUM =
  '010052000204000000030000200000000000050030102000041800000070000000000000020000000|618452379274193685539786214381529467456837192792641853963278541147365928825914736|21:24,33,34,43;8:18,27;16:45,54;21:41,50,51,60;21:7,15,16;17:68,76,77,78;14:71,80;17:4,13,14;12:2,11;16:20,21;9:63,72;9:36,37;17:48,49,58;11:26,35;9:46;9:66,67;9:55,56;9:0,1,9;2:57;13:64,65,73;8:59;5:3,12;6:44,53,62;14:22,23;20:29,30,38,39;11:19,28;9:32;14:74,75;6:61,70;14:8,17;5:31,40;7:10;1:42;1:25;9:69;3:79;2:47;5:52;5:5,6'

const DAILY_CLASSIC = {
  givens:
    '009031057000600042050000000560970400090000020001064039000000090910006000730850100',
  solution:
    '629431857178695342354728916563972481497183625281564739846217593915346278732859164',
}

test('solves the daily classic puzzle', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()

  await sudokuPage.solve(DAILY_CLASSIC)

  await expect(sudokuPage.dialog).toContainText('Solved!')
})

test('shows and counts a wrong number', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()

  await sudokuPage.enter({ row: 1, column: 1, digit: 9 })

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 9, wrong/ })
  await expect(sudokuPage.subtitle).toContainText('Mistakes: 1')
  await sudokuPage.expectScreenshot('wrong-number')
})

test('pencils in notes', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()
  await sudokuPage.cell({ row: 1, column: 1 }).click()

  await sudokuPage.tool(/^Notes off/)
  await sudokuPage.tapDigit(5)
  await sudokuPage.tapDigit(6)

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, empty/ })
})

test('undoes and redoes a number', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()
  await sudokuPage.enter({ row: 1, column: 1, digit: 5 })

  await sudokuPage.undo()
  await sudokuPage.expectCell({ row: 1, column: 1, state: /, empty/ })
  await sudokuPage.redo()

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 5/ })
})

test('keeps progress after a reload', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()
  await sudokuPage.enter({ row: 1, column: 1, digit: 5 })

  await sudokuPage.reload()

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 5/ })
})

test('draws the cages of the daily killer puzzle', async ({ sudokuPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/killer_medium.txt',
    puzzle: KILLER_MEDIUM,
  })
  await sudokuPage.chooseMode('Killer')

  await sudokuPage.openDaily()

  await sudokuPage.expectCell({ row: 1, column: 1, state: /cage \d+/ })
})

test('offers only this mode’s dailies and a new puzzle of this level', async ({
  sudokuPage,
}) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()
  await sudokuPage.solve(DAILY_CLASSIC)

  await expect(sudokuPage.winTile('Daily Expert')).toBeVisible()
  await expect(sudokuPage.winTile('Daily Medium')).toBeHidden()
  await expect(sudokuPage.winTile('Daily Evil')).toBeHidden()

  await sudokuPage.winTile('New Medium').click()

  await expect(sudokuPage.dialog).toBeHidden()
  await expect(sudokuPage.title).toHaveText('Classic · Medium')
})
