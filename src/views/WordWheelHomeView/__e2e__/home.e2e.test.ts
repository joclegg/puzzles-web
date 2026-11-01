import { expect, test } from '@e2e/playwrightExtensions'

test('shows the levels and today’s puzzles', async ({ wordWheelPage }) => {
  await expect(
    wordWheelPage.page.getByRole('button', { name: 'Daily 5 letters' }),
  ).toBeVisible()
})

test('starts a new puzzle of a level', async ({ wordWheelPage }) => {
  await wordWheelPage.startLevel(6)

  await expect(wordWheelPage.crossword).toBeVisible()
})

test('goes home from the solved dialog', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)
  for (const word of ['BROTH', 'BOTH', 'ROB', 'ROT', 'HOT']) {
    await wordWheelPage.typeWord(word)
  }
  await expect(wordWheelPage.dialog).toContainText('Solved!')

  await wordWheelPage.goHome()

  await expect(wordWheelPage.continueCard).toBeHidden()
})
