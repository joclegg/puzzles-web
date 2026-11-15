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

test(
  'types letters along the word',
  { tag: '@desktop' },
  async ({ crosswordPage }) => {
    await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
    await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
    await crosswordPage.openDaily('Small')

    await crosswordPage.typeLetters('sid')

    await crosswordPage.expectCell({ row: 1, column: 1, state: /, S$/ })
    await crosswordPage.expectCell({ row: 1, column: 2, state: /, I$/ })
    await crosswordPage.expectCell({ row: 1, column: 3, state: /, D$/ })
    await crosswordPage.expectCell({ row: 1, column: 4, state: /selected/ })
    await crosswordPage.expectScreenshot('typed-letters')
  },
)

test(
  'clears one letter per backspace, moving back',
  { tag: '@desktop' },
  async ({ crosswordPage }) => {
    await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
    await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
    await crosswordPage.openDaily('Small')
    await crosswordPage.typeLetters('BEE')
    await crosswordPage.tapCell({ row: 3, column: 1 })
    await crosswordPage.typeLetters('BEE')

    await crosswordPage.backspace(3)

    await crosswordPage.expectCell({ row: 3, column: 1, state: /empty/ })
    await crosswordPage.expectCell({ row: 3, column: 2, state: /empty/ })
    await crosswordPage.expectCell({ row: 3, column: 3, state: /empty/ })
    await crosswordPage.expectCell({ row: 3, column: 1, state: /selected/ })
    await crosswordPage.expectCell({ row: 1, column: 3, state: /, E$/ })
  },
)

test(
  'moves to the next clue when a word is done',
  { tag: '@desktop' },
  async ({ crosswordPage }) => {
    await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
    await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
    await crosswordPage.openDaily('Small')

    await crosswordPage.typeLetters('SIDLE')

    await crosswordPage.expectClue('4 Across')
    await crosswordPage.expectCell({ row: 1, column: 7, state: /selected/ })
  },
)

test(
  'moves with the arrow keys, Tab and Space',
  { tag: '@desktop' },
  async ({ crosswordPage }) => {
    await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
    await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
    await crosswordPage.openDaily('Small')

    await crosswordPage.pressKey('ArrowDown')
    await crosswordPage.expectClue('1 Down')
    await crosswordPage.pressKey('ArrowDown')
    await crosswordPage.expectCell({ row: 2, column: 1, state: /selected/ })
    await crosswordPage.pressKey('Tab')
    await crosswordPage.expectClue('2 Down')
    await crosswordPage.pressKey('Space')

    await crosswordPage.expectClue('1 Across')
  },
)

test(
  'types and deletes through the mobile keyboard',
  { tag: '@mobile' },
  async ({ crosswordPage }) => {
    await crosswordPage.useBank({ path: 'crossword/small.txt', lines: [SMALL] })
    await crosswordPage.useBank({ path: 'crossword/clues.txt', lines: CLUES })
    await crosswordPage.openDaily('Small')
    await crosswordPage.tapCell({ row: 1, column: 1 })

    await crosswordPage.insertLetters('sob')
    await crosswordPage.expectCell({ row: 3, column: 1, state: /, B$/ })
    await crosswordPage.deleteBackward(3)

    await crosswordPage.expectCell({ row: 1, column: 1, state: /empty/ })
    await crosswordPage.expectCell({ row: 2, column: 1, state: /empty/ })
    await crosswordPage.expectCell({ row: 3, column: 1, state: /empty/ })
    await crosswordPage.expectCell({ row: 1, column: 1, state: /selected/ })
    await expect(crosswordPage.input).toBeFocused()
  },
)
