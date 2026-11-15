import { expect, test } from '@e2e/playwrightExtensions'

const BEGINNER = '4;212H,313H,142H,022H,402V,103H,242V,132V,542H,513H'

test('shows the solution and ends the puzzle', async ({
  slideOutPage,
  assistsPage,
}) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')

  await assistsPage.showSolution()

  await expect(assistsPage.hintButton).toBeDisabled()
})
