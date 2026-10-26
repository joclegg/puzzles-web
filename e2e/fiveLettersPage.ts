import { expect, type Locator, type Page } from '@playwright/test'

export class FiveLettersPage {
  readonly page: Page
  readonly dailyButton: Locator
  readonly nytButton: Locator
  readonly status: Locator
  readonly dialog: Locator
  readonly guesses: Locator
  readonly hardModeLabel: Locator

  constructor(page: Page) {
    this.page = page
    this.dailyButton = page.getByRole('button', { name: /Today's word/ })
    this.nytButton = page.getByRole('button', { name: /NY Times daily/ })
    this.status = page.getByRole('status')
    this.dialog = page.getByRole('dialog')
    this.guesses = page.getByRole('grid', { name: 'Guesses' })
    this.hardModeLabel = page.getByText('Hard mode', { exact: true })
  }

  async open() {
    await this.page.goto('./#/five-letters')
    await expect(this.dailyButton).toBeVisible()
  }

  async openDaily() {
    await this.dailyButton.click()
    await expect(this.key('ENTER')).toBeVisible()
  }

  async fakeNytWord(word: string) {
    await this.page.route('https://r.jina.ai/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: `Markdown Content:\n{"solution":"${word}"}`,
      }),
    )
  }

  async failNytWord() {
    await this.page.route('https://r.jina.ai/**', (route) => route.abort())
  }

  async openNytDaily() {
    await this.nytButton.click()
    await expect(this.key('ENTER')).toBeVisible()
  }

  async reload() {
    await this.page.reload()
  }

  key(label: string) {
    return this.page.getByRole('button', { name: label, exact: true })
  }

  cell({ row, column }: { row: number; column: number }) {
    return this.guesses
      .getByRole('row')
      .nth(row)
      .getByRole('gridcell')
      .nth(column)
  }

  async tapWord(word: string) {
    for (const letter of word) {
      await this.key(letter).click()
    }
    await this.key('ENTER').click()
  }

  async typeWord(word: string) {
    await this.page.keyboard.type(word)
    await this.page.keyboard.press('Enter')
  }

  async closeDialog() {
    await this.page.keyboard.press('Escape')
    await expect(this.dialog).toBeHidden()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async openStats() {
    await this.back()
    await this.page.getByRole('button', { name: 'Stats' }).click()
  }

  async openSettings() {
    await this.page.getByRole('button', { name: 'Settings' }).click()
  }

  async toggleSetting(name: string) {
    await this.page.getByRole('switch', { name: new RegExp(name) }).click()
  }

  async expectStat({ label, value }: { label: string; value: string }) {
    await expect(this.page.getByLabel(label, { exact: true })).toHaveText(value)
  }

  async expectNytUnavailable() {
    await expect(this.page.getByRole('alert')).toContainText(
      "Couldn't reach the New York Times",
    )
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  }
}
