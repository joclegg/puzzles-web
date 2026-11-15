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
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
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
