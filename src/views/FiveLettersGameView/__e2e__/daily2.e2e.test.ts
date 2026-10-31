import { expect, test } from '@e2e/playwrightExtensions'

test('plays Daily puzzle 2 as its own daily', async ({ fiveLettersPage }) => {
  await fiveLettersPage.fakeDaily2Word('geeky')
  await fiveLettersPage.openDaily2()

  await fiveLettersPage.typeWord('GEEKY')

  await expect(fiveLettersPage.dialog).toContainText('Got it in 1!')
  await fiveLettersPage.closeDialog()
  await fiveLettersPage.back()
  await expect(fiveLettersPage.daily2Button).toContainText('Solved')
  await expect(fiveLettersPage.dailyButton).not.toContainText('Solved')
  await fiveLettersPage.expectScreenshot('daily2-solved')
})

test('says when Daily puzzle 2 cannot be loaded', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.failDaily2Word()

  await fiveLettersPage.daily2Button.click()

  await fiveLettersPage.expectDaily2Unavailable()
})
