import { expect, type Locator, type Page } from '@playwright/test'

export class LegalPage {
  readonly page: Page
  readonly privacyHeading: Locator
  readonly deleteHeading: Locator
  readonly dialog: Locator

  constructor(page: Page) {
    this.page = page
    this.privacyHeading = page.getByRole('heading', {
      name: 'Privacy policy',
      level: 1,
    })
    this.deleteHeading = page.getByRole('heading', {
      name: 'Delete your account',
      level: 1,
    })
    this.dialog = page.getByRole('dialog')
  }

  async openPrivacy() {
    await this.page.goto('./#/privacy')
    await expect(this.privacyHeading).toBeVisible()
  }

  async openDeleteAccount() {
    await this.page.goto('./#/delete-account')
    await expect(this.deleteHeading).toBeVisible()
  }

  link(name: string) {
    return this.page.getByRole('link', { name, exact: true })
  }

  button(name: string) {
    return this.page.getByRole('button', { name, exact: true })
  }

  async follow(name: string) {
    await this.link(name).click()
  }

  async back() {
    await this.button('Back').click()
  }

  async expectText(text: string) {
    await expect(this.page.getByText(text)).toBeVisible()
  }
}
