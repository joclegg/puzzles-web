import { expect, test } from '@e2e/playwrightExtensions'

test('solves the daily word with the on-screen keys', async ({
  fiveLettersPage,
}) => {
  await fiveLettersPage.openDaily()

  await fiveLettersPage.tapWord('CRANE')
  await fiveLettersPage.tapWord('TEMPO')

  await expect(fiveLettersPage.dialog).toContainText('Got it in 2!')
})

test('marks the tiles of a guess', async ({ fiveLettersPage }) => {
  await fiveLettersPage.openDaily()

  await fiveLettersPage.typeWord('TOPIC')

  await expect(
    fiveLettersPage.cell({ row: 0, column: 0 }),
  ).toHaveAccessibleName('T correct')
  await expect(
    fiveLettersPage.cell({ row: 0, column: 1 }),
  ).toHaveAccessibleName('O present')
  await expect(
    fiveLettersPage.cell({ row: 0, column: 3 }),
  ).toHaveAccessibleName('I absent')
  await fiveLettersPage.expectScreenshot('daily-guess')
})

test('rejects a word that is not in the list', async ({ fiveLettersPage }) => {
  await fiveLettersPage.openDaily()

  await fiveLettersPage.typeWord('ZZZZZ')

  await expect(fiveLettersPage.status).toHaveText('Not in the word list')
})

test('keeps the daily progress after a reload', async ({ fiveLettersPage }) => {
  await fiveLettersPage.openDaily()
  await fiveLettersPage.typeWord('CRANE')

  await fiveLettersPage.reload()

  await expect(
    fiveLettersPage.cell({ row: 0, column: 0 }),
  ).toHaveAccessibleName('C absent')
})

test('counts a win in the stats', async ({ fiveLettersPage }) => {
  await fiveLettersPage.openDaily()
  await fiveLettersPage.typeWord('TEMPO')
  await fiveLettersPage.closeDialog()

  await fiveLettersPage.openStats()

  await fiveLettersPage.expectStat({ label: 'Played', value: '1' })
  await fiveLettersPage.expectStat({ label: 'Streak', value: '1' })
})
