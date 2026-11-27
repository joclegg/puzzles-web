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

test('explains the rules', async ({ crosswordPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')

  await crosswordPage.showRules()

  await expect(crosswordPage.dialog).toContainText(
    'Tap it again to switch between across and down.',
  )
})

test('walks through the controls', async ({ crosswordPage, assistsPage }) => {
  await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
  await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
  await crosswordPage.openDaily('Small')
  await assistsPage.startWalkthrough()

  await assistsPage.nextStep()

  await assistsPage.expectStep("This is the clue for the word you're on.")
  await expect(assistsPage.walkthrough).toContainText('Step 2 of 4')
})
