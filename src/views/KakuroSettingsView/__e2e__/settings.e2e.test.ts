import { expect, test } from '@e2e/playwrightExtensions'

test('offers the combination order only with the sum helper on', async ({
  settingsPage,
}) => {
  await settingsPage.open('kakuro')
  await expect(settingsPage.option('Decreasing')).toBeHidden()

  await settingsPage.toggle('Sum helper')

  await settingsPage.expectOption('Increasing')
})

test('lists combinations in decreasing order', async ({
  settingsPage,
  kakuroPage,
}) => {
  await settingsPage.open('kakuro')
  await settingsPage.toggle('Sum helper')
  await settingsPage.choose('Decreasing')
  await settingsPage.back()
  await kakuroPage.openDaily(6)

  await kakuroPage.tapCell({ row: 2, column: 3 })

  await expect(kakuroPage.combinations).toContainText('Across 3 in 2: 21')
})

test('keeps a setting after a reload', async ({ settingsPage }) => {
  await settingsPage.open('kakuro')
  await settingsPage.toggle('Highlight runs')

  await settingsPage.open('kakuro')

  await settingsPage.expectSetting({ name: 'Highlight runs', checked: false })
})
