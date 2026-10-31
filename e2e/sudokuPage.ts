import { expect, type Locator, type Page } from '@playwright/test'

export class SudokuPage {
  readonly page: Page
  readonly board: Locator
  readonly dialog: Locator
  readonly subtitle: Locator
  readonly title: Locator

  constructor(page: Page) {
    this.page = page
    this.board = page.getByRole('grid', { name: 'Board' })
    this.dialog = page.getByRole('dialog')
    this.title = page.getByRole('heading', { level: 1 })
    this.subtitle = page.getByRole('heading', { level: 1 }).locator('+ p')
  }

  async open() {
    await this.page.goto('./#/sudoku')
    await expect(
      this.page.getByRole('heading', { name: 'Sudoku' }),
    ).toBeVisible()
  }

  async chooseMode(name: 'Classic' | 'Killer') {
    await this.page.getByRole('radio', { name }).click()
  }

  async openDaily(level = 'Medium') {
    await this.page.getByRole('button', { name: `Daily ${level}` }).click()
    await expect(this.board).toBeVisible()
  }

  winTile(name: string) {
    return this.dialog.getByRole('navigation').getByLabel(name)
  }

  async startLevel(name: string) {
    await this.page
      .getByRole('button', { name: new RegExp(`^${name}`) })
      .click()
    await expect(this.board).toBeVisible()
  }

  cell({ row, column }: { row: number; column: number }) {
    return this.board.getByRole('gridcell', {
      name: new RegExp(`^Row ${row} column ${column},`),
    })
  }

  async enter({
    row,
    column,
    digit,
  }: {
    row: number
    column: number
    digit: number
  }) {
    await this.cell({ row, column }).click()
    await this.page.keyboard.press(String(digit))
  }

  async tapDigit(digit: number) {
    await this.page.getByRole('button', { name: `Digit ${digit}` }).click()
  }

  async solve({ givens, solution }: { givens: string; solution: string }) {
    for (const [cell, digit] of [...solution].entries()) {
      if (givens[cell] === '0') {
        await this.enter({
          row: Math.floor(cell / 9) + 1,
          column: (cell % 9) + 1,
          digit: Number(digit),
        })
      }
    }
  }

  async tool(name: RegExp) {
    await this.page.getByRole('button', { name }).click()
  }

  async undo() {
    await this.page.getByRole('button', { name: 'Undo the last move' }).click()
  }

  async redo() {
    await this.page
      .getByRole('button', { name: 'Redo the move you undid' })
      .click()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async reload() {
    await this.page.reload()
  }

  async closeDialog() {
    await this.page.keyboard.press('Escape')
    await expect(this.dialog).toBeHidden()
  }

  async openFromHome(name: string) {
    await this.page.getByRole('button', { name, exact: true }).click()
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

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.subtitle],
    })
  }
}
