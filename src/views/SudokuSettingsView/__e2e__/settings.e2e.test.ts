import { expect, test } from '@e2e/playwrightExtensions'

test('keeps the helpers separate for Classic and Killer', async ({
  settingsPage,
}) => {
  await settingsPage.open('sudoku')
  await settingsPage.choose('Killer')
  await settingsPage.toggle('Hints')
  await settingsPage.expectSetting({ name: 'Hints', checked: false })

  await settingsPage.choose('Classic')

  await settingsPage.expectSetting({ name: 'Hints', checked: true })
  await settingsPage.expectSetting({ name: 'Show solution', checked: true })
})

test('shows the hint button only in the mode with hints on', async ({
  settingsPage,
  sudokuPage,
  assistsPage,
}) => {
  await settingsPage.open('sudoku')
  await settingsPage.choose('Killer')
  await settingsPage.toggle('Hints')
  await settingsPage.back()

  await sudokuPage.openDaily()
  await expect(assistsPage.hintButton).toBeVisible()
  await sudokuPage.back()
  await sudokuPage.chooseMode('Killer')
  await sudokuPage.openDaily()

  await expect(assistsPage.hintButton).toBeHidden()
})

test('offers the hint fill switch only when hints are on', async ({
  settingsPage,
}) => {
  await settingsPage.open('sudoku')
  await settingsPage.expectSetting({
    name: 'Hints fill the answer in',
    checked: false,
  })
  await settingsPage.expectText(
    'Off: a hint points at the next step and says why.',
  )

  await settingsPage.toggle('Hints')

  await expect(settingsPage.setting('Hints fill the answer in')).toBeHidden()
})

test.describe('a new player', () => {
  test.use({ helpers: false })

  test('starts with hints off and How to play on in both modes', async ({
    settingsPage,
  }) => {
    await settingsPage.open('sudoku')
    await settingsPage.expectSetting({ name: 'Hints', checked: false })
    await settingsPage.expectSetting({ name: 'How to play', checked: true })
    await settingsPage.expectScreenshot('new-player-classic')

    await settingsPage.choose('Killer')

    await settingsPage.expectSetting({ name: 'Hints', checked: false })
    await settingsPage.expectSetting({ name: 'How to play', checked: true })
  })

  test('copies helpers saved before they were per mode into both modes', async ({
    settingsPage,
  }) => {
    await settingsPage.seed({
      key: 'sudoku.settings',
      value: {
        showHints: true,
        hintStyle: 'fill',
        classic: { showTimer: true },
        killer: { showTimer: true },
      },
    })
    await settingsPage.open('sudoku')
    await settingsPage.expectSetting({ name: 'Hints', checked: true })
    await settingsPage.expectSetting({
      name: 'Hints fill the answer in',
      checked: true,
    })

    await settingsPage.choose('Killer')

    await settingsPage.expectSetting({ name: 'Hints', checked: true })
    await settingsPage.expectSetting({
      name: 'Hints fill the answer in',
      checked: true,
    })
  })
})
