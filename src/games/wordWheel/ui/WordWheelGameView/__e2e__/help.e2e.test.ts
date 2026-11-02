import { expect, test } from '@e2e/playwrightExtensions'

test('explains the rules', async ({ wordWheelPage }) => {
  await wordWheelPage.openDaily(5)

  await wordWheelPage.showRules()

  await expect(wordWheelPage.dialog).toContainText(
    'Each letter can be used once per word.',
  )
})

test('walks through the controls', async ({ wordWheelPage, assistsPage }) => {
  await wordWheelPage.openDaily(5)

  await assistsPage.startWalkthrough()

  await assistsPage.expectStep('Find every word in this crossword.')
})

test('steps on to the letters', async ({ wordWheelPage, assistsPage }) => {
  await wordWheelPage.openDaily(5)
  await assistsPage.startWalkthrough()

  await assistsPage.nextStep()

  await assistsPage.expectStep('Swipe across the letters')
})
