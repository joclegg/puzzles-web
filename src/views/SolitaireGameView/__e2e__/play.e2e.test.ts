import { expect, test } from '@e2e/playwrightExtensions'

test('deals the daily game', async ({ solitairePage }) => {
  await solitairePage.openDaily()

  await expect(solitairePage.card('10 of spades')).toBeVisible()
  await solitairePage.expectScreenshot('daily-deal')
})

test('draws from the stock and undoes it', async ({ solitairePage }) => {
  await solitairePage.openDaily()

  await solitairePage.draw()
  await expect(solitairePage.waste).toContainText('Q')
  await solitairePage.undo()

  await expect(solitairePage.waste.getByRole('button')).toHaveCount(0)
})

test('sends a card to the best place with one tap', async ({
  solitairePage,
}) => {
  await solitairePage.openDaily()

  await solitairePage.tapCard('9 of diamonds')

  await expect(
    solitairePage.column(1).getByRole('button', { name: '9 of diamonds' }),
  ).toBeVisible()
})

test('keeps the game after a reload', async ({ solitairePage }) => {
  await solitairePage.openDaily()
  await solitairePage.draw()

  await solitairePage.reload()

  await expect(solitairePage.waste).toContainText('Q')
})

test('wins when the last kings go up', async ({ solitairePage }) => {
  await solitairePage.seedNearlyWonGame()

  for (const king of [
    'King of clubs',
    'King of diamonds',
    'King of hearts',
    'King of spades',
  ]) {
    await solitairePage.tapCard(king)
  }

  await expect(solitairePage.dialog).toContainText('You won!')
  await solitairePage.expectScreenshot('won')
})

test('finishes the game once every card is face up', async ({
  solitairePage,
}) => {
  await solitairePage.seedNearlyWonGame()

  await solitairePage.finish()

  await expect(solitairePage.dialog).toContainText('You won!')
})

test('drags a card onto its foundation', async ({ solitairePage }) => {
  await solitairePage.seedNearlyWonGame()

  await solitairePage.dragCard({
    name: 'King of clubs',
    to: 'Foundation clubs, Queen of clubs',
  })

  await expect(
    solitairePage.card('Foundation clubs, King of clubs'),
  ).toBeVisible()
})
