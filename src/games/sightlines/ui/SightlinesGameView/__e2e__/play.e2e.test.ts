import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_4 = { givens: '..X...X.44.24..X', solution: 'BBRBBBRBBBRBBBRR' }

test('solves the daily 4 x 4 puzzle', async ({ sightlinesPage }) => {
  await sightlinesPage.openDaily(4)

  await sightlinesPage.fillDots(DAILY_4)

  await expect(sightlinesPage.dialog).toContainText('Solved!')
})

test('cycles a dot through blue, red and empty and undoes it', async ({
  sightlinesPage,
}) => {
  await sightlinesPage.openDaily(4)

  await sightlinesPage.tapDot({ row: 1, column: 1 })
  await sightlinesPage.expectDot({ row: 1, column: 1, state: /, blue/ })
  await sightlinesPage.tapDot({ row: 1, column: 1 })
  await sightlinesPage.expectDot({ row: 1, column: 1, state: /, red/ })
  await sightlinesPage.undo()

  await sightlinesPage.expectDot({ row: 1, column: 1, state: /, blue/ })
})

test('marks a number that can no longer see enough', async ({
  sightlinesPage,
}) => {
  await sightlinesPage.openDaily(4)

  await sightlinesPage.tapDot({ row: 3, column: 3 })
  await sightlinesPage.tapDot({ row: 3, column: 3 })
  await sightlinesPage.tapDot({ row: 2, column: 4 })
  await sightlinesPage.tapDot({ row: 2, column: 4 })

  await sightlinesPage.expectDot({ row: 3, column: 4, state: /breaks a rule/ })
  await sightlinesPage.expectScreenshot('broken-rule')
})

test('explains the next step as a hint', async ({ sightlinesPage }) => {
  await sightlinesPage.openDaily(4)

  await sightlinesPage.hint()

  await expect(sightlinesPage.hintMessage).not.toBeEmpty()
})

test('keeps progress after a reload', async ({ sightlinesPage }) => {
  await sightlinesPage.openDaily(4)
  await sightlinesPage.tapDot({ row: 1, column: 1 })

  await sightlinesPage.reload()

  await sightlinesPage.expectDot({ row: 1, column: 1, state: /, blue/ })
})

test('shows how many dots each number sees now', async ({
  settingsPage,
  sightlinesPage,
}) => {
  await settingsPage.open('sightlines')
  await settingsPage.toggle('Show what numbers see now')
  await settingsPage.back()
  await sightlinesPage.openDaily(4)
  await expect(sightlinesPage.dot({ row: 3, column: 1 })).toHaveText('42')

  await sightlinesPage.tapDot({ row: 2, column: 1 })

  await expect(sightlinesPage.dot({ row: 3, column: 1 })).toHaveText('43')
})
