import { expect, type Locator, type Page } from '@playwright/test'

export class SlideOutPage {
  readonly page: Page
  readonly board: Locator
  readonly dialog: Locator
  readonly status: Locator

  constructor(page: Page) {
    this.page = page
    this.board = page.getByRole('group', { name: 'Board' })
    this.dialog = page.getByRole('dialog')
    this.status = page.getByRole('heading', { level: 1 }).locator('+ p')
  }

  async open() {
    await this.page.goto('./#/slide-out')
    await expect(
      this.page.getByRole('heading', { name: 'Slide Out' }),
    ).toBeVisible()
  }

  async openDaily(level: string) {
    await this.page.getByRole('button', { name: `Daily ${level}` }).click()
    await expect(this.board).toBeVisible()
  }

  block(index: number) {
    return this.board.getByRole('button', {
      name: new RegExp(index === 0 ? '^Red block,' : `^Block ${index},`),
    })
  }

  async slideBy({ block, steps }: { block: number; steps: number }) {
    const target = this.block(block)
    const horizontal = /across/.test(
      (await target.getAttribute('aria-label')) ?? '',
    )
    const key = horizontal
      ? steps > 0
        ? 'ArrowRight'
        : 'ArrowLeft'
      : steps > 0
        ? 'ArrowDown'
        : 'ArrowUp'
    for (let i = 0; i < Math.abs(steps); i++) {
      await target.press(key)
    }
  }

  async dragBy({ block, cells }: { block: number; cells: number }) {
    const target = this.block(block)
    const box = (await target.boundingBox())!
    const boardBox = (await this.board.boundingBox())!
    const cell = boardBox.width / 6
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await this.page.mouse.move(x, y)
    await this.page.mouse.down()
    await this.page.mouse.move(x + (cell * cells) / 2, y, { steps: 4 })
    await this.page.mouse.move(x + cell * cells, y, { steps: 4 })
    await this.page.mouse.up()
  }

  async goHomeFromDialog() {
    await this.dialog.getByRole('button', { name: 'Home' }).click()
  }

  async browserBack() {
    await this.page.goBack()
  }

  async undo() {
    await this.page.getByRole('button', { name: 'Undo the last move' }).click()
  }

  async hint() {
    await this.page.getByRole('button', { name: 'Show a hint' }).click()
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

  async openFromHome(name: 'Stats' | 'History' | 'Settings') {
    await this.page.getByRole('button', { name, exact: true }).click()
  }

  async expectBlock({ block, at }: { block: number; at: RegExp }) {
    await expect(this.block(block)).toHaveAccessibleName(at)
  }

  async expectStatsRow({ level, text }: { level: string; text: RegExp }) {
    await expect(
      this.page.getByRole('row', { name: new RegExp(`^${level}`) }),
    ).toHaveText(text)
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.status],
    })
  }
}
