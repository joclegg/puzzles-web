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

test('points at the next letter with a hint', async ({
  crosswordPage,
  assistsPage,
}) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Hints')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')

  await assistsPage.hint()

  await assistsPage.expectStatus('Try S here.')
})

test('fills the letter in with a hint', async ({
  crosswordPage,
  assistsPage,
}) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openSettings()
  await crosswordPage.toggleSetting('Hints')
  await crosswordPage.toggleSetting('Hints fill the answer in')
  await crosswordPage.back()
  await crosswordPage.openDaily('Small')

  await assistsPage.hint()

  await crosswordPage.expectCell({ row: 1, column: 1, state: /, S, selected$/ })
})

test('hides the hint button when hints are off', async ({
  crosswordPage,
  assistsPage,
}) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await expect(assistsPage.hintButton).toBeHidden()
})
