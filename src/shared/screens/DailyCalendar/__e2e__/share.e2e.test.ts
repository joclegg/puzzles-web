import { test } from '@e2e/playwrightExtensions'

test("shares today's dailies", async ({ twoTonePage }) => {
  await twoTonePage.openScreen('daily')

  await twoTonePage.share("Share today's dailies")

  await twoTonePage.expectShareCopied("Share today's dailies")
})
