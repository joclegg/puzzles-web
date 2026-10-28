import { expect, type Locator, type Page } from '@playwright/test'

const RANKS = 'A23456789TJQ'

const SUIT_CODES = ['C', 'D', 'H', 'S']

export class SolitairePage {
  readonly page: Page
  readonly dialog: Locator
  readonly stock: Locator
  readonly waste: Locator

  constructor(page: Page) {
    this.page = page
    this.dialog = page.getByRole('dialog')
    this.stock = page.getByRole('button', { name: /^Stock/ })
    this.waste = page.getByRole('group', { name: 'Waste' })
  }

  async open() {
    await this.page.goto('./#/solitaire')
    await expect(
      this.page.getByRole('heading', { name: 'Solitaire' }),
    ).toBeVisible()
  }

  async seedNearlyWonGame() {
    const foundations = SUIT_CODES.map((suit) =>
      [...RANKS].map((rank) => `${rank}${suit}`).join(''),
    ).join('|')
    const game = {
      id: 'nearly-won',
      dealId: 'deal_1',
      drawMode: 'drawOne',
      order: 'down',
      board: `/KC|/KD|/KH|/KS|/|/|/;;;${foundations}`,
      moves: '',
      moveCount: 0,
      elapsedMs: 0,
      status: 'inProgress',
      startedAt: 1,
      finishedAt: null,
    }
    await this.page.addInitScript(
      (saved) => {
        localStorage.setItem('solitaire.games', saved)
      },
      JSON.stringify([game]),
    )
    await this.page.goto('./#/solitaire/game/nearly-won')
    await this.page.reload()
    await expect(this.card('King of clubs')).toBeVisible()
  }

  async openDaily() {
    await this.page.getByRole('button', { name: /^Daily deal/ }).click()
    await expect(this.stock).toBeVisible()
  }

  card(name: string) {
    return this.page.getByRole('button', { name, exact: true })
  }

  column(index: number) {
    return this.page.getByRole('group', { name: `Column ${index}` })
  }

  async tapCard(name: string) {
    await this.card(name).click()
  }

  async dragCard({ name, to }: { name: string; to: string }) {
    const from = (await this.card(name).boundingBox())!
    const target = (await this.page
      .getByRole('button', { name: to })
      .boundingBox())!
    await this.page.mouse.move(from.x + from.width / 2, from.y + 10)
    await this.page.mouse.down()
    await this.page.mouse.move(
      target.x + target.width / 2,
      target.y + target.height / 2,
      { steps: 8 },
    )
    await this.page.mouse.up()
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click()
  }

  async draw() {
    await this.stock.click()
  }

  async undo() {
    await this.page.getByRole('button', { name: 'Undo the last move' }).click()
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

  async chooseOption(name: string) {
    await this.page.getByRole('radio', { name }).click()
  }

  async expectStat({ mode, text }: { mode: string; text: RegExp }) {
    await expect(this.page.getByRole('region', { name: mode })).toHaveText(text)
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.page.getByRole('heading', { level: 1 }).locator('+ p')],
    })
  }
}
