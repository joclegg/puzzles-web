import { expect, type Locator, type Page } from '@playwright/test'

export class AssistsPage {
  readonly page: Page
  readonly hintButton: Locator
  readonly status: Locator
  readonly walkthrough: Locator

  constructor(page: Page) {
    this.page = page
    this.hintButton = page.getByRole('button', { name: 'Show a hint' })
    this.status = page.getByRole('status')
    this.walkthrough = page.getByRole('dialog', { name: 'Walkthrough' })
  }

  async hint() {
    await this.hintButton.click()
  }

  async startWalkthrough() {
    await this.page.getByRole('button', { name: 'Show the rules' }).click()
    await this.page.getByRole('button', { name: 'Walk me through it' }).click()
  }

  async nextStep() {
    await this.walkthrough.getByRole('button', { name: 'Next' }).click()
  }

  async showSolution(item = 'Show solution') {
    await this.page.getByRole('button', { name: 'More' }).click()
    await this.page.getByRole('menuitem', { name: item }).click()
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: item, exact: false })
      .last()
      .click()
  }

  async expectStatus(text: string | RegExp) {
    await expect(this.status).toHaveText(text)
  }

  async expectStep(text: string) {
    await expect(this.walkthrough).toContainText(text)
  }
}
