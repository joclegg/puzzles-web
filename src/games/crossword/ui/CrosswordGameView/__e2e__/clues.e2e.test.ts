import { test } from '@e2e/playwrightExtensions'

test('shows the first clue with its length', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')

  await crosswordPage.expectClue('1 Across Edge furtively (5)')
})

test('steps through the clues with the arrows', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')

  await crosswordPage.nextClue()
  await crosswordPage.expectClue('4 Across After fourth (5)')
  await crosswordPage.previousClue()
  await crosswordPage.previousClue()

  await crosswordPage.expectClue('18 Down Joker (3)')
})

test('selects a word from the clue list', async ({ crosswordPage }) => {
  await crosswordPage.openDaily('Small')

  await crosswordPage.tapClue({ list: 'Across', clue: 'Honey maker' })

  await crosswordPage.expectClue('7 Across')
  await crosswordPage.expectCell({ row: 3, column: 1, state: /selected/ })
})

test('switches direction when the cell is tapped again', async ({
  crosswordPage,
}) => {
  await crosswordPage.openDaily('Small')

  await crosswordPage.tapCell({ row: 1, column: 1 })

  await crosswordPage.expectClue('1 Down Not drunk (5)')
})
