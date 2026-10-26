import { test as base } from '@playwright/test'

import { FiveLettersPage } from '@e2e/fiveLettersPage'
import { KakuroPage } from '@e2e/kakuroPage'
import { LauncherPage } from '@e2e/launcherPage'
import { SightlinesPage } from '@e2e/sightlinesPage'
import { SlideOutPage } from '@e2e/slideOutPage'
import { SolitairePage } from '@e2e/solitairePage'
import { TwoTonePage } from '@e2e/twoTonePage'
import { WordWheelPage } from '@e2e/wordWheelPage'

const FIXED_NOW = new Date('2026-10-25T10:00:00')

export const test = base.extend<{
  launcherPage: LauncherPage
  fiveLettersPage: FiveLettersPage
  twoTonePage: TwoTonePage
  sightlinesPage: SightlinesPage
  kakuroPage: KakuroPage
  slideOutPage: SlideOutPage
  wordWheelPage: WordWheelPage
  solitairePage: SolitairePage
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
  kakuroPage: async ({ page }, use) => {
    const kakuroPage = new KakuroPage(page)
    await kakuroPage.open()
    await use(kakuroPage)
  },
  slideOutPage: async ({ page }, use) => {
    const slideOutPage = new SlideOutPage(page)
    await slideOutPage.open()
    await use(slideOutPage)
  },
  wordWheelPage: async ({ page }, use) => {
    const wordWheelPage = new WordWheelPage(page)
    await wordWheelPage.open()
    await use(wordWheelPage)
  },
  solitairePage: async ({ page }, use) => {
    const solitairePage = new SolitairePage(page)
    await solitairePage.open()
    await use(solitairePage)
  },
})

export { expect } from '@playwright/test'
