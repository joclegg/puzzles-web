import { test } from '@e2e/playwrightExtensions'

test('a daily link opens that puzzle, and going back lands on Home', async ({
  slideOutPage,
}) => {
  await slideOutPage.openDailyLink('easy')

  await slideOutPage.goBack()

  await slideOutPage.expectHome()
})
