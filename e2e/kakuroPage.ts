import { expect, type Locator, type Page } from '@playwright/test'

export class KakuroPage {
  readonly page: Page
  readonly board: Locator
  readonly dialog: Locator
  readonly combinations: Locator

  constructor(page: Page) {
    this.page = page
    this.board = page.getByRole('grid', { name: 'Board' })
    this.dialog = page.getByRole('dialog')
    this.combinations = page.getByRole('list', { name: 'Combinations' })
  }

  async open() {
    await this.page.goto('./#/kakuro')
    await expect(
      this.page.getByRole('heading', { name: 'Kakuro' }),
    ).toBeVisible()
  }

  async openDaily(size: number) {
    await this.page
      .getByRole('button', { name: `Daily ${size} x ${size}` })
      .click()
    await expect(this.board).toBeVisible()
  }

  cell({ row, column }: { row: number; column: number }) {
    return this.board.getByRole('gridcell', {
      name: new RegExp(`^Row ${row} column ${column},`),
    })
  }

  async tapCell({ row, column }: { row: number; column: number }) {
    await this.cell({ row, column }).click()
  }

  async tapDigit(digit: number) {
    await this.page.getByRole('button', { name: `Digit ${digit}` }).click()
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
    await this.tapCell({ row, column })
    await this.tapDigit(digit)
  }

  async solve({ solution, givens }: { solution: string; givens: number[] }) {
    const size = Math.sqrt(solution.length)
    for (const [cell, digit] of [...solution].entries()) {
      if (digit === '0' || givens.includes(cell)) {
        continue
      }
      await this.enter({
        row: Math.floor(cell / size) + 1,
        column: (cell % size) + 1,
        digit: Number(digit),
      })
    }
  }

  async tool(name: RegExp) {
    await this.page.getByRole('button', { name }).click()
  }

  async undo() {
    await this.page.getByRole('button', { name: 'Undo the last tap' }).click()
  }

  async redo() {
    await this.page
      .getByRole('button', { name: 'Redo the tap you undid' })
      .click()
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

  async chooseOption(name: string) {
    await this.page.getByRole('radio', { name }).click()
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
      mask: [this.page.getByRole('heading', { level: 1 }).locator('+ p')],
    })
  }
}
