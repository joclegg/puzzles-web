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

  async openSignIn() {
    await this.page.getByRole('button', { name: 'Sign in to sync' }).click()
  }

  async expectSignInChoices() {
    const dialog = this.page.getByRole('dialog', { name: 'Sign in to sync' })
    await expect(dialog.getByRole('button', { name: 'Google' })).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Microsoft' }),
    ).toBeVisible()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  }
}
