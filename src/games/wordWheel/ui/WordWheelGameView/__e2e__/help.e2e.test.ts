import { expect, test } from '@e2e/playwrightExtensions'

const FIVE = 'TOHBR;BROTH@1,2,A|BOTH@1,2,D|ROB@0,4,D|ROT@3,0,A|HOT@1,6,D'
const VALID_WORDS = ['BROTH', 'BOTH', 'ROB', 'ROT', 'HOT', 'ORB']

test('explains the rules', async ({ wordWheelPage }) => {
  await wordWheelPage.useBank({ path: 'wordwheel/five.txt', lines: [FIVE] })
  await wordWheelPage.useBank({
    path: 'wordwheel/valid.txt',
    lines: VALID_WORDS,
  })
  await wordWheelPage.openDaily(5)

  await wordWheelPage.showRules()

  await expect(wordWheelPage.dialog).toContainText(
    'Each letter can be used once per word.',
  )
})

test('walks through the controls', async ({ wordWheelPage, assistsPage }) => {
  await wordWheelPage.useBank({ path: 'wordwheel/five.txt', lines: [FIVE] })
  await wordWheelPage.useBank({
    path: 'wordwheel/valid.txt',
    lines: VALID_WORDS,
  })
  await wordWheelPage.openDaily(5)

  await assistsPage.startWalkthrough()

  await assistsPage.expectStep('Find every word in this crossword.')
})

test('steps on to the letters', async ({ wordWheelPage, assistsPage }) => {
  await wordWheelPage.useBank({ path: 'wordwheel/five.txt', lines: [FIVE] })
  await wordWheelPage.useBank({
    path: 'wordwheel/valid.txt',
    lines: VALID_WORDS,
  })
  await wordWheelPage.openDaily(5)
  await assistsPage.startWalkthrough()

  await assistsPage.nextStep()

  await assistsPage.expectStep('Swipe across the letters')
})
