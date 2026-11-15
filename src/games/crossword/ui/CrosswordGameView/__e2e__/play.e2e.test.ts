import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_SMALL =
  'SIDLE#FIFTHO#O#X#O#E#YBEE#AUSTEREE###M#T#L#NRATE#RETINA##W#J#R#N##PREFAB#UGLYL#L#B#H###OAFFABLE#WOKZ#T#E#R#A#EABHOR#BAGEL'

test('solves the daily small crossword', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')

  await crosswordPage.solve(DAILY_SMALL)

  await expect(crosswordPage.dialog).toContainText('Solved!')
})

test('undoes and redoes a letter', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })
  await crosswordPage.typeLetters('I')

  await crosswordPage.undo()
  await crosswordPage.expectCell({ row: 1, column: 2, state: /empty/ })
  await crosswordPage.redo()

  await crosswordPage.expectCell({ row: 1, column: 2, state: /, I(, |$)/ })
})

test('keeps progress after a reload', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })
  await crosswordPage.typeLetters('I')

  await crosswordPage.reload()

  await crosswordPage.expectCell({ row: 1, column: 2, state: /, I(, |$)/ })
})

test('shows wrong letters with mistakes on', async ({ crosswordPage }) => {
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Show mistakes')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })

  await crosswordPage.typeLetters('X')

  await crosswordPage.expectCell({ row: 1, column: 2, state: /wrong/ })
})

test('reveals a word', async ({ crosswordPage }) => {
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Reveal')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')

  await crosswordPage.menu('Reveal word')

  await crosswordPage.expectCell({ row: 1, column: 5, state: /, E$/ })
})
