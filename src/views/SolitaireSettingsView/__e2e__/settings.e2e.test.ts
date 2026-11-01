import { expect, test } from '@e2e/playwrightExtensions'

test('describes the unwinnable check like the apps', async ({
  settingsPage,
}) => {
  await settingsPage.open('solitaire')

  await settingsPage.expectText(
    'Checks after a full pass through the stock with no move, and offers to undo to the last winnable position.',
  )
  await settingsPage.expectScreenshot('settings')
})

test('deals a Draw 3 reverse game', async ({ settingsPage, solitairePage }) => {
  await settingsPage.open('solitaire')
  await settingsPage.choose('Draw 3')
  await settingsPage.toggle('Reverse')
  await settingsPage.back()

  await solitairePage.newGame()

  await expect(solitairePage.title).toHaveText('Draw 3 · Reverse')
})
