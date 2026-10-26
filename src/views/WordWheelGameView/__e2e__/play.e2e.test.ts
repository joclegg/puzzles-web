import { expect, test } from '@e2e/playwrightExtensions'

test('solves the daily 5-letter puzzle', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)
  await wordWheelPage.expectScreenshot('daily-start')

  for (const word of ['BROTH', 'BOTH', 'ROB', 'ROT', 'HOT']) {
    await wordWheelPage.typeWord(word)
  }

  await expect(wordWheelPage.dialog).toContainText('Solved!')
  await wordWheelPage.expectScreenshot('daily-solved')
})

test('fills a word by tapping letters', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)

  await wordWheelPage.tapWord('HOT')

  await expect(wordWheelPage.status).toHaveText('Nice!')
  await wordWheelPage.expectShownLetters(3)
})

test(
  'fills a word by swiping',
  { tag: '@desktop' },
  async ({ wordWheelPage }) => {
    await wordWheelPage.openDaily(5)

    await wordWheelPage.swipeWord('ROB')

    await expect(wordWheelPage.status).toHaveText('Nice!')
  },
)

test('counts other real words as bonus words', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)

  await wordWheelPage.typeWord('ORB')

  await expect(wordWheelPage.status).toHaveText('Bonus word!')
})

test('refuses words that are not real', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)

  await wordWheelPage.typeWord('THOB')

  await expect(wordWheelPage.status).toHaveText('Not a word')
})

test('shows a letter as a hint', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)

  await wordWheelPage.showLetter()

  await wordWheelPage.expectShownLetters(1)
})

test('keeps found words after a reload', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)
  await wordWheelPage.typeWord('BROTH')

  await wordWheelPage.reload()

  await wordWheelPage.expectShownLetters(5)
})
