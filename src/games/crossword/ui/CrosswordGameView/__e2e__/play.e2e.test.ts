import { expect, test } from '@e2e/playwrightExtensions'

const SMALL =
  '11;SIDLE#FIFTHO#O#X#O#E#YBEE#AUSTEREE###M#T#L#NRATE#RETINA##W#J#R#N##PREFAB#UGLYL#L#B#H###OAFFABLE#WOKZ#T#E#R#A#EABHOR#BAGEL'
const CLUES = [
  'ABHOR;Loathe',
  'AFFABLE;Genial',
  'AUSTERE;Severe',
  'BAGEL;Ring-shaped roll',
  'BEE;Honey maker',
  'DOE;Female deer',
  'EXAM;Test',
  'FEELING;Sensation',
  'FIFTH;After fourth',
  'FOSTER;Nurture',
  'HERB;Thyme or sage',
  'HYENA;Laughing scavenger',
  'JABBER;Chatter',
  'PLAZA;Square',
  'PREFAB;Kit-built house',
  'RATE;Speed',
  'RETINA;Part of the eye',
  'SIDLE;Edge furtively',
  'SOBER;Not drunk',
  'TWELFTH;Ordinal after eleventh',
  'UGLY;Unsightly',
  'WAG;Joker',
  'WOK;Chinese pan',
  'YOKEL;Bumpkin',
]

const DAILY_SMALL =
  'SIDLE#FIFTHO#O#X#O#E#YBEE#AUSTEREE###M#T#L#NRATE#RETINA##W#J#R#N##PREFAB#UGLYL#L#B#H###OAFFABLE#WOKZ#T#E#R#A#EABHOR#BAGEL'

test('solves the daily small crossword', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.solve(DAILY_SMALL)

  await expect(crosswordPage.dialog).toContainText('Solved!')
})

test('undoes and redoes a letter', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })
  await crosswordPage.typeLetters('I')

  await crosswordPage.undo()
  await crosswordPage.expectCell({ row: 1, column: 2, state: /empty/ })
  await crosswordPage.redo()

  await crosswordPage.expectCell({ row: 1, column: 2, state: /, I(, |$)/ })
})

test('keeps progress after a reload', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })
  await crosswordPage.typeLetters('I')

  await crosswordPage.reload()

  await crosswordPage.expectCell({ row: 1, column: 2, state: /, I(, |$)/ })
})

test('shows wrong letters with mistakes on', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Show mistakes')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')
  await crosswordPage.tapCell({ row: 1, column: 2 })

  await crosswordPage.typeLetters('X')

  await crosswordPage.expectCell({ row: 1, column: 2, state: /wrong/ })
})

test('reveals a word', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Reveal')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')

  await crosswordPage.menu('Reveal word')

  await crosswordPage.expectCell({ row: 1, column: 5, state: /, E$/ })
})
