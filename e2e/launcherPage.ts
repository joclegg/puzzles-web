import { expect, type Locator, type Page } from '@playwright/test'

export class LauncherPage {
  readonly page: Page
  readonly heading: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Puzzles' })
  }

  async open() {
    await this.page.goto('./')
    await expect(this.heading).toBeVisible()
  }

  gameLink(name: string) {
    return this.page.getByRole('link', { name: new RegExp(`^${name}`) })
  }

  async openGame(name: string) {
    await this.gameLink(name).click()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  }
}
