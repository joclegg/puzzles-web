import { expect, test } from '@e2e/playwrightExtensions'

const CLASSIC_MEDIUM =
  '009031057000600042050000000560970400090000020001064039000000090910006000730850100|629431857178695342354728916563972481497183625281564739846217593915346278732859164|'
const KILLER_MEDIUM =
  '010052000204000000030000200000000000050030102000041800000070000000000000020000000|618452379274193685539786214381529467456837192792641853963278541147365928825914736|21:24,33,34,43;8:18,27;16:45,54;21:41,50,51,60;21:7,15,16;17:68,76,77,78;14:71,80;17:4,13,14;12:2,11;16:20,21;9:63,72;9:36,37;17:48,49,58;11:26,35;9:46;9:66,67;9:55,56;9:0,1,9;2:57;13:64,65,73;8:59;5:3,12;6:44,53,62;14:22,23;20:29,30,38,39;11:19,28;9:32;14:74,75;6:61,70;14:8,17;5:31,40;7:10;1:42;1:25;9:69;3:79;2:47;5:52;5:5,6'

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
  await sudokuPage.useBank({
    path: 'sudoku/classic_medium.txt',
    puzzle: CLASSIC_MEDIUM,
  })
  await sudokuPage.useBank({
    path: 'sudoku/killer_medium.txt',
    puzzle: KILLER_MEDIUM,
  })
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
