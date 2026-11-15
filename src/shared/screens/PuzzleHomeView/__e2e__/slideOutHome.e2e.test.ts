import { expect, test } from '@e2e/playwrightExtensions'

const BEGINNER = '4;212H,313H,142H,022H,402V,103H,242V,132V,542H,513H'

test('shows the levels and today’s puzzles', async ({ slideOutPage }) => {
  await expect(
    slideOutPage.page.getByRole('button', { name: 'Daily Beginner' }),
  ).toBeVisible()
})

test('counts a puzzle solved at par in the stats', async ({ slideOutPage }) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')
  for (const move of [
    { block: 1, steps: -1 },
    { block: 6, steps: 1 },
    { block: 7, steps: 2 },
    { block: 0, steps: 3 },
  ]) {
    await slideOutPage.slideBy(move)
  }
  await slideOutPage.closeDialog()
  await slideOutPage.back()

  await slideOutPage.openFromHome('Stats')

  await slideOutPage.expectStatsRow({
    level: 'Beginner',
    text: /Beginner1\/11/,
  })
})
