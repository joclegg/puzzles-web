import { test } from '@e2e/playwrightExtensions'

test('shows the levels and today’s puzzles', async ({ slideOutPage }) => {
  await slideOutPage.expectScreenshot('home')
})

test('counts a puzzle solved at par in the stats', async ({ slideOutPage }) => {
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
