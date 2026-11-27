import { expect, test } from '@e2e/playwrightExtensions'

const CLASSIC_MEDIUM =
  '009031057000600042050000000560970400090000020001064039000000090910006000730850100|629431857178695342354728916563972481497183625281564739846217593915346278732859164|'

test('points at a cell that can be filled and says why', async ({
  sudokuPage,
  assistsPage,
}) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()

  await assistsPage.hint()

  await assistsPage.expectStatus(/Only \d fits here|can only go here/)
})

test('walks through the controls', async ({ sudokuPage, assistsPage }) => {
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.openDaily()

  await assistsPage.startWalkthrough()
  await assistsPage.expectStep('Tap a cell')
  await assistsPage.nextStep()

  await assistsPage.expectStep('then a number to place it')
  await expect(assistsPage.walkthrough).toContainText('Step 2 of 4')
})
