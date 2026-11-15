import { expect, test } from '@e2e/playwrightExtensions'

const DRAW_ONE_DOWN = '733151820757464953'

test('offers to resume a game in progress', async ({ solitairePage }) => {
  await solitairePage.useBank({
    path: 'solitaire/drawOne_down.txt',
    lines: [DRAW_ONE_DOWN],
  })
  await solitairePage.newGame()
  await solitairePage.draw()
  await solitairePage.back()

  await solitairePage.tapNewGame()
  await solitairePage.answerResume('Resume')

  await expect(solitairePage.waste.getByRole('button')).not.toHaveCount(0)
})

test('deals a new game instead of resuming', async ({ solitairePage }) => {
  await solitairePage.useBank({
    path: 'solitaire/drawOne_down.txt',
    lines: [DRAW_ONE_DOWN],
  })
  await solitairePage.newGame()
  await solitairePage.draw()
  await solitairePage.back()

  await solitairePage.tapNewGame()
  await solitairePage.answerResume('New deal')

  await expect(solitairePage.waste.getByRole('button')).toHaveCount(0)
})
