import { expect, test } from '@e2e/playwrightExtensions'

const DRAW_THREE_UP = '5042353489672502275'

test('describes the unwinnable check like the apps', async ({
  settingsPage,
}) => {
  await settingsPage.open('solitaire')

  await settingsPage.expectText(
    'Checks after a full pass through the stock with no move, and offers to undo to the last winnable position.',
  )
})

test('deals a Draw 3 reverse game', async ({ settingsPage, solitairePage }) => {
  await solitairePage.useBank({
    path: 'solitaire/drawThree_up.txt',
    lines: [DRAW_THREE_UP],
  })
  await settingsPage.open('solitaire')
  await settingsPage.choose('Draw 3')
  await settingsPage.toggle('Reverse')
  await settingsPage.back()

  await solitairePage.newGame()

  await expect(solitairePage.title).toHaveText('Draw 3 · Reverse')
})
