import { expect, test } from '@e2e/playwrightExtensions'

test('shows the levels and today’s puzzle', async ({ sudokuPage }) => {
  await sudokuPage.expectScreenshot('home')
})

test('starts a game of a level', async ({ sudokuPage }) => {
  await sudokuPage.startLevel('Fast')

  await expect(sudokuPage.cell({ row: 6, column: 6 })).toBeVisible()
})

test('gives a bronze medal for one daily on the day', async ({
  sudokuPage,
}) => {
  await sudokuPage.openDaily()
  await sudokuPage.solve({
    givens:
      '009031057000600042050000000560970400090000020001064039000000090910006000730850100',
    solution:
      '629431857178695342354728916563972481497183625281564739846217593915346278732859164',
  })
  await sudokuPage.closeDialog()
  await sudokuPage.back()

  await sudokuPage.openFromHome('Daily calendar')

  await expect(
    sudokuPage.page.getByRole('button', { name: '2026-10-25, bronze medal' }),
  ).toBeVisible()
  await sudokuPage.expectScreenshot('calendar')
})

test('plays an entered puzzle', async ({ sudokuPage }) => {
  await sudokuPage.openFromHome('Enter puzzle')
  await sudokuPage.cell({ row: 1, column: 1 }).click()
  await sudokuPage.tapDigit(5)

  await sudokuPage.openFromHome('Play this puzzle')
  await sudokuPage.openFromHome('Play anyway')

  await sudokuPage.expectCell({ row: 1, column: 1, state: /, 5, given/ })
})

test('offers to resume a game of a level in progress', async ({
  sudokuPage,
}) => {
  await sudokuPage.startLevel('Easy')
  await sudokuPage.back()
  await expect(sudokuPage.levelTile('Easy')).toContainText('In progress')

  await sudokuPage.tapLevel('Easy')
  await sudokuPage.answerResume('Resume')

  await expect(sudokuPage.title).toContainText('Easy')
})
