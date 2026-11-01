import { expect, type Locator, type Page } from '@playwright/test'

export class SettingsPage {
  readonly page: Page
  readonly heading: Locator
  readonly tabs: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Settings', level: 1 })
    this.tabs = page.getByRole('navigation', { name: 'Games' })
  }

  async open(route: string) {
    await this.page.goto(`./#/${route}/settings`)
    await expect(this.heading).toBeVisible()
  }

  async seed({ key, value }: { key: string; value: object }) {
    await this.page.addInitScript(
      (entry) => localStorage.setItem(entry.key, entry.value),
      { key, value: JSON.stringify(value) },
    )
  }

  async openTab(name: string) {
    await this.tabs.getByRole('link', { name, exact: true }).click()
    await this.expectTab(name)
  }

  setting(name: string) {
    return this.page
      .locator('label')
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('switch')
  }

  option(name: string) {
    return this.page.getByRole('radio', { name, exact: true })
  }

  async toggle(name: string) {
    await this.setting(name).click()
  }

  async choose(name: string) {
    await this.option(name).click()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async expectTab(name: string) {
    await expect(
      this.tabs.getByRole('link', { name, exact: true }),
    ).toHaveAttribute('aria-current', 'page')
  }

  async expectSetting({ name, checked }: { name: string; checked: boolean }) {
    await expect(this.setting(name)).toBeChecked({ checked })
  }

  async expectOption(name: string) {
    await expect(this.option(name)).toBeChecked()
  }

  async expectText(text: string) {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible()
  }
}
