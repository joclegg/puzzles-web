import { test } from '@e2e/playwrightExtensions'

const EASY = '10;212H,142V,322V,432V,442H,052V,252V,332H,512H,132V'

test('a daily link opens that puzzle, and going back lands on Home', async ({
  slideOutPage,
}) => {
  await slideOutPage.useBank({ path: 'slideout/easy.txt', lines: [EASY] })
  await slideOutPage.openDailyLink('easy')

  await slideOutPage.goBack()

  await slideOutPage.expectHome()
})
