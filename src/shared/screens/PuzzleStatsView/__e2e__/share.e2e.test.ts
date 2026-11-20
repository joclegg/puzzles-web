import { test } from '@e2e/playwrightExtensions'

test('shares the records', async ({ twoTonePage }) => {
  await twoTonePage.openScreen('stats')

  await twoTonePage.share('Share your records')

  await twoTonePage.expectShareCopied('Share your records')
})
