import { expect, test } from '@e2e/playwrightExtensions'

const SIX =
  'UESDTI;SUITED@3,3,A|SUITE@3,3,D|DIET@2,5,D|SUIT@6,0,A|SIDE@0,7,D|SITE@6,0,D|TIDE@5,5,A|USED@0,6,A'
const VALID_WORDS = [
  'BROTH',
  'BOTH',
  'ROB',
  'ROT',
  'HOT',
  'ORB',
  'SUITED',
  'SUITE',
  'DIET',
  'SUIT',
  'SIDE',
  'SITE',
  'TIDE',
  'USED',
]
const FIVE = 'TOHBR;BROTH@1,2,A|BOTH@1,2,D|ROB@0,4,D|ROT@3,0,A|HOT@1,6,D'

test('shows the levels and today’s puzzles', async ({ wordWheelPage }) => {
  await expect(
    wordWheelPage.page.getByRole('button', { name: 'Daily 5 letters' }),
  ).toBeVisible()
})

test('starts a new puzzle of a level', async ({ wordWheelPage }) => {
  await wordWheelPage.useBank({ path: 'wordwheel/six.txt', lines: [SIX] })
  await wordWheelPage.useBank({
    path: 'wordwheel/valid.txt',
    lines: VALID_WORDS,
  })
  await wordWheelPage.startLevel(6)

  await expect(wordWheelPage.crossword).toBeVisible()
})

test('goes home from the solved dialog', async ({ wordWheelPage }) => {
  await wordWheelPage.useBank({ path: 'wordwheel/five.txt', lines: [FIVE] })
  await wordWheelPage.useBank({
    path: 'wordwheel/valid.txt',
    lines: VALID_WORDS,
  })
  await wordWheelPage.openDaily(5)
  for (const word of ['BROTH', 'BOTH', 'ROB', 'ROT', 'HOT']) {
    await wordWheelPage.typeWord(word)
  }
  await expect(wordWheelPage.dialog).toContainText('Solved!')

  await wordWheelPage.goHome()

  await expect(wordWheelPage.continueCard).toBeHidden()
})
