import { APP_PROMPT_KEY } from '@/shared/lib/appStore.constants'
import { test as base } from '@playwright/test'

import { LEGACY_SETTINGS } from '@/shared/storage/legacySettings.constants'
import { AssistsPage } from '@e2e/assistsPage'
import { refuseUndeclaredBanks } from '@e2e/banks'
import { CrosswordPage } from '@e2e/crosswordPage'
import { FiveLettersPage } from '@e2e/fiveLettersPage'
import { KakuroPage } from '@e2e/kakuroPage'
import { LauncherPage } from '@e2e/launcherPage'
import { LegalPage } from '@e2e/legalPage'
import { SettingsPage } from '@e2e/settingsPage'
import { SightlinesPage } from '@e2e/sightlinesPage'
import { SlideOutPage } from '@e2e/slideOutPage'
import { SolitairePage } from '@e2e/solitairePage'
import { SudokuPage } from '@e2e/sudokuPage'
import { TwoTonePage } from '@e2e/twoTonePage'
import { WordWheelPage } from '@e2e/wordWheelPage'

const FIXED_NOW = new Date('2026-10-25T10:00:00')

export const test = base.extend<{
  assistsPage: AssistsPage
  settingsPage: SettingsPage
  launcherPage: LauncherPage
  legalPage: LegalPage
  fiveLettersPage: FiveLettersPage
  twoTonePage: TwoTonePage
  sightlinesPage: SightlinesPage
  kakuroPage: KakuroPage
  slideOutPage: SlideOutPage
  wordWheelPage: WordWheelPage
  crosswordPage: CrosswordPage
  solitairePage: SolitairePage
  sudokuPage: SudokuPage
  helpers: boolean
  appPrompt: boolean
}>({
  helpers: [true, { option: true }],
  appPrompt: [false, { option: true }],
  page: async ({ page, helpers, appPrompt }, use) => {
    await page.clock.setFixedTime(FIXED_NOW)
    if (!appPrompt) {
      await page.addInitScript((key) => {
        if (localStorage.getItem(key) === null) {
          localStorage.setItem(key, JSON.stringify('web'))
        }
      }, APP_PROMPT_KEY)
    }
    if (helpers) {
      await page.addInitScript((settings) => {
        for (const [key, value] of Object.entries(settings)) {
          if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(value))
          }
        }
      }, LEGACY_SETTINGS)
    }
    const refused = await refuseUndeclaredBanks(page)
    await use(page)
    if (refused.length > 0) {
      throw new Error(
        `The test did not declare these banks: ${refused.join(', ')}`,
      )
    }
  },
  assistsPage: async ({ page }, use) => {
    await use(new AssistsPage(page))
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page))
  },
  legalPage: async ({ page }, use) => {
    await use(new LegalPage(page))
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
  crosswordPage: async ({ page }, use) => {
    const crosswordPage = new CrosswordPage(page)
    await crosswordPage.open()
    await use(crosswordPage)
  },
  solitairePage: async ({ page }, use) => {
    const solitairePage = new SolitairePage(page)
    await solitairePage.open()
    await use(solitairePage)
  },
  sudokuPage: async ({ page }, use) => {
    const sudokuPage = new SudokuPage(page)
    await sudokuPage.open()
    await use(sudokuPage)
  },
})

export { expect } from '@playwright/test'
