import { test } from '@e2e/playwrightExtensions'

test('keeps a setting after a reload', async ({ settingsPage }) => {
  await settingsPage.open('crossword')
  await settingsPage.toggle('Skip filled cells')

  await settingsPage.open('crossword')

  await settingsPage.expectSetting({
    name: 'Skip filled cells',
    checked: false,
  })
})

test('types over filled cells with skipping off', async ({
  settingsPage,
  crosswordPage,
}) => {
  await settingsPage.open('crossword')
  await settingsPage.toggle('Skip filled cells')
  await settingsPage.back()
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })
  await crosswordPage.typeLetters('I')
  await crosswordPage.tapCell({ row: 1, column: 1 })

  await crosswordPage.typeLetters('SX')

  await crosswordPage.expectCell({ row: 1, column: 2, state: /, X$/ })
})
