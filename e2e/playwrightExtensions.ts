import { test as base } from '@playwright/test'

import { FiveLettersPage } from '@e2e/fiveLettersPage'
import { LauncherPage } from '@e2e/launcherPage'

const FIXED_NOW = new Date('2026-10-25T10:00:00')

export const test = base.extend<{
  launcherPage: LauncherPage
  fiveLettersPage: FiveLettersPage
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
})

export { expect } from '@playwright/test'
