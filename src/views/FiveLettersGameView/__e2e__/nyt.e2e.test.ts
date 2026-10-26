import { expect, test } from '@e2e/playwrightExtensions'

test('plays the New York Times word as its own daily', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.fakeNytWord('geeky')
  await fiveLettersPage.openNytDaily()

  await fiveLettersPage.typeWord('GEEKY')

  await expect(fiveLettersPage.dialog).toContainText('Got it in 1!')
  await fiveLettersPage.closeDialog()
  await fiveLettersPage.back()
  await expect(fiveLettersPage.nytButton).toContainText('Solved ✓')
  await expect(fiveLettersPage.dailyButton).not.toContainText('Solved')
  await fiveLettersPage.expectScreenshot('nyt-solved')
})

test('says when the New York Times cannot be reached', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.failNytWord()

  await fiveLettersPage.nytButton.click()

  await fiveLettersPage.expectNytUnavailable()
})
