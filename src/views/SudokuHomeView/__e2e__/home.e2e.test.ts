import { expect, test } from '@e2e/playwrightExtensions'

test('shows the levels and today’s puzzle', async ({ sudokuPage }) => {
  await sudokuPage.expectScreenshot('home')
})

test('starts a game of a level', async ({ sudokuPage }) => {
  await sudokuPage.startLevel('Fast')

  await expect(sudokuPage.cell({ row: 6, column: 6 })).toBeVisible()
})

test('gives a silver medal for one daily on the day', async ({
  sudokuPage,
}) => {
  await sudokuPage.openDaily()
  await sudokuPage.solve({
    givens:
      '000000784080401060407680000006000007890000056100000300000014502010802030259000000',
    solution:
      '561329784983471265427685913346598127892137456175246398638914572714852639259763841',
  })
  await sudokuPage.closeDialog()
  await sudokuPage.back()

  await sudokuPage.openFromHome('Daily calendar')

  await expect(
    sudokuPage.page.getByRole('button', { name: '2026-10-25, silver medal' }),
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
