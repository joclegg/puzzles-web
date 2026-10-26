import { test as base } from '@playwright/test'

import { FiveLettersPage } from '@e2e/fiveLettersPage'
import { LauncherPage } from '@e2e/launcherPage'
import { SightlinesPage } from '@e2e/sightlinesPage'
import { TwoTonePage } from '@e2e/twoTonePage'

const FIXED_NOW = new Date('2026-10-25T10:00:00')

export const test = base.extend<{
  launcherPage: LauncherPage
  fiveLettersPage: FiveLettersPage
  twoTonePage: TwoTonePage
  sightlinesPage: SightlinesPage
}>({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(FIXED_NOW)
    await use(page)
  },
  launcherPage: async ({ page }, use) => {
    const launcherPage = new LauncherPage(page)
    await launcherPage.open()
    await use(launcherPage)
  },
  fiveLettersPage: async ({ page }, use) => {
    const fiveLettersPage = new FiveLettersPage(page)
    await fiveLettersPage.open()
    await use(fiveLettersPage)
  },
  twoTonePage: async ({ page }, use) => {
    const twoTonePage = new TwoTonePage(page)
    await twoTonePage.open()
    await use(twoTonePage)
  },
  sightlinesPage: async ({ page }, use) => {
    const sightlinesPage = new SightlinesPage(page)
    await sightlinesPage.open()
    await use(sightlinesPage)
  },
})

export { expect } from '@playwright/test'
