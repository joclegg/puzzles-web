import { expect, type Locator, type Page } from '@playwright/test'
import { serveBank } from '@e2e/banks'

export class CrosswordPage {
  readonly page: Page
  readonly board: Locator
  readonly input: Locator
  readonly clue: Locator
  readonly dialog: Locator

  constructor(page: Page) {
    this.page = page
    this.board = page.getByRole('grid', { name: 'Board' })
    this.input = page.getByRole('textbox', { name: 'Type letters' })
    this.clue = page.getByLabel('Current clue')
    this.dialog = page.getByRole('dialog')
  }

  async useBank({ path, lines }: { path: string; lines: string[] }) {
    await serveBank({ page: this.page, path, lines })
  }

  async open() {
    await this.page.goto('./#/crossword')
    await expect(
      this.page.getByRole('heading', { name: 'Crossword' }),
    ).toBeVisible()
  }

  async openDaily(size: string) {
    await this.page.getByRole('button', { name: `Daily ${size}` }).click()
    await expect(this.board).toBeVisible()
  }

  async showRules() {
    await this.page.getByRole('button', { name: 'Show the rules' }).click()
  }

  cell({ row, column }: { row: number; column: number }) {
    return this.board.getByRole('gridcell', {
      name: new RegExp(`^Row ${row} column ${column},`),
    })
  }

  async tapCell({ row, column }: { row: number; column: number }) {
    await this.cell({ row, column }).click()
  }

  async typeLetters(text: string) {
    await this.page.keyboard.type(text)
  }

  async insertLetters(text: string) {
    for (const letter of text) {
      await this.page.keyboard.insertText(letter)
    }
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key)
  }

  async backspace(times = 1) {
    for (let press = 0; press < times; press += 1) {
      await this.page.keyboard.press('Backspace')
    }
  }

  async deleteBackward(times = 1) {
    for (let press = 0; press < times; press += 1) {
      await this.input.fill('')
    }
  }

  async nextClue() {
    await this.page.getByRole('button', { name: 'Next clue' }).click()
  }

  async previousClue() {
    await this.page.getByRole('button', { name: 'Previous clue' }).click()
  }

  async tapClue({ list, clue }: { list: string; clue: string }) {
    await this.page
      .getByRole('region', { name: list })
      .getByRole('button', { name: clue })
      .click()
  }

  async solve(solution: string) {
    const size = Math.sqrt(solution.length)
    for (const [cell, letter] of [...solution].entries()) {
      if (letter === '#') {
        continue
      }
      await this.tapCell({
        row: Math.floor(cell / size) + 1,
        column: (cell % size) + 1,
      })
      await this.typeLetters(letter)
    }
  }

  async undo() {
    await this.page
      .getByRole('button', { name: 'Undo the last letter' })
      .click()
  }

  async redo() {
    await this.page
      .getByRole('button', { name: 'Redo the letter you undid' })
      .click()
  }

  async menu(item: string) {
    await this.page.getByRole('button', { name: 'More' }).click()
    await this.page.getByRole('menuitem', { name: item }).click()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async reload() {
    await this.page.reload()
  }

  async openSettings() {
    await this.page
      .getByRole('button', { name: 'Settings', exact: true })
      .click()
  }

  async toggleSetting(name: string) {
    await this.page
      .locator('label')
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('switch')
      .click()
  }

  async expectCell({
    row,
    column,
    state,
  }: {
    row: number
    column: number
    state: RegExp
  }) {
    await expect(this.cell({ row, column })).toHaveAccessibleName(state)
  }

  async expectClue(text: string) {
    await expect(this.clue).toContainText(text)
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.page.getByRole('heading', { level: 1 }).locator('+ p')],
    })
  }
}
