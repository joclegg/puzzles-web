import { expect, type Locator, type Page } from '@playwright/test'

const TAPS_FOR = { R: 1, B: 2 } as const

export class TwoTonePage {
  readonly page: Page
  readonly board: Locator
  readonly dialog: Locator
  readonly hintMessage: Locator
  readonly timer: Locator

  constructor(page: Page) {
    this.page = page
    this.board = page.getByRole('grid', { name: 'Board' })
    this.dialog = page.getByRole('dialog')
    this.hintMessage = page.getByRole('status')
    this.timer = page.getByRole('timer')
  }

  async open() {
    await this.page.goto('./#/two-tone')
    await expect(
      this.page.getByRole('heading', { name: 'Two Tone' }),
    ).toBeVisible()
  }

  async openDaily(size: number) {
    await this.page
      .getByRole('button', { name: `Daily ${size} x ${size}` })
      .click()
    await expect(this.board).toBeVisible()
  }

  async startSize(size: number) {
    await this.page
      .getByRole('button', { name: new RegExp(`^${size} x ${size}`) })
      .click()
    await expect(this.board).toBeVisible()
  }

  tile({ row, column }: { row: number; column: number }) {
    return this.board.getByRole('gridcell', {
      name: new RegExp(`^Row ${row} column ${column},`),
    })
  }

  async tapTile({ row, column }: { row: number; column: number }) {
    await this.tile({ row, column }).click()
  }

  async fillTiles({ givens, solution }: { givens: string; solution: string }) {
    const size = Math.sqrt(solution.length)
    for (const [cell, tile] of [...solution].entries()) {
      if (givens[cell] !== '.') {
        continue
      }
      const taps = TAPS_FOR[tile as keyof typeof TAPS_FOR]
      for (let i = 0; i < taps; i++) {
        await this.tapTile({
          row: Math.floor(cell / size) + 1,
          column: (cell % size) + 1,
        })
      }
    }
  }

  async closeDialog() {
    await this.page.keyboard.press('Escape')
    await expect(this.dialog).toBeHidden()
  }

  async reload() {
    await this.page.reload()
  }

  async undo() {
    await this.page.getByRole('button', { name: 'Undo the last tap' }).click()
  }

  async hint() {
    await this.page.getByRole('button', { name: 'Show a hint' }).click()
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async openFromHome(name: 'Stats' | 'History' | 'Settings') {
    await this.page.getByRole('button', { name, exact: true }).click()
  }

  async chooseInputMode(name: string) {
    await this.page.getByRole('radio', { name }).click()
  }

  async pickColour(name: string) {
    await this.page.getByRole('radio', { name }).click()
  }

  async expectTile({
    row,
    column,
    state,
  }: {
    row: number
    column: number
    state: RegExp
  }) {
    await expect(this.tile({ row, column })).toHaveAccessibleName(state)
  }

  async expectStatsRow({ size, text }: { size: number; text: RegExp }) {
    await expect(
      this.page.getByRole('row', { name: new RegExp(`^${size} x ${size}`) }),
    ).toHaveText(text)
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.timer],
    })
  }
}
