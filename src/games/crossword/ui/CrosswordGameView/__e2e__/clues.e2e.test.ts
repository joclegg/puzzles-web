import { test } from '@e2e/playwrightExtensions'

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

test('shows the first clue with its length', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.expectClue('1 Across Edge furtively (5)')
})

test('steps through the clues with the arrows', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.nextClue()
  await crosswordPage.expectClue('4 Across After fourth (5)')
  await crosswordPage.previousClue()
  await crosswordPage.previousClue()

  await crosswordPage.expectClue('18 Down Joker (3)')
})

test('selects a word from the clue list', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.tapClue({ list: 'Across', clue: 'Honey maker' })

  await crosswordPage.expectClue('7 Across')
  await crosswordPage.expectCell({ row: 3, column: 1, state: /selected/ })
})

test('switches direction when the cell is tapped again', async ({
  crosswordPage,
}) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.tapCell({ row: 1, column: 1 })

  await crosswordPage.expectClue('1 Down Not drunk (5)')
})
