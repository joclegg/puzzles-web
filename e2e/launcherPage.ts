import { expect, type Locator, type Page } from '@playwright/test'

export class LauncherPage {
  readonly page: Page
  readonly heading: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Puzzles' })
  }

  async open() {
    await this.page.goto('./')
    await expect(this.heading).toBeVisible()
  }

  async seedDailySolitaireWin() {
    const finished = new Date('2026-10-25T09:30:00').getTime()
    const game = {
      id: 'won-daily',
      dealId: 'daily_2026-10-25',
      drawMode: 'drawOne',
      order: 'down',
      board: '',
      moves: '',
      moveCount: 120,
      elapsedMs: 300000,
      status: 'won',
      startedAt: finished - 300000,
      finishedAt: finished,
    }
    await this.page.addInitScript(
      (saved) => {
        localStorage.setItem('solitaire.games', saved)
      },
      JSON.stringify([game]),
    )
    await this.open()
  }

  async openSettings() {
    await this.page.getByRole('link', { name: 'Settings' }).click()
  }

  async openHistory() {
    await this.page.getByRole('link', { name: 'History' }).click()
  }

  async expectHistoryRow(text: string) {
    await expect(this.page.getByRole('listitem').first()).toContainText(text)
  }

  medal(name: string) {
    return this.page.getByRole('img', { name })
  }

  gameLink(name: string) {
    return this.page.getByRole('link', { name: new RegExp(`^${name}`) })
  }

  async openGame(name: string) {
    await this.gameLink(name).click()
  }

  async openSignIn() {
    await this.page.getByRole('button', { name: 'Sign in to sync' }).click()
  }

  async expectSignInChoices() {
    const dialog = this.page.getByRole('dialog', { name: 'Sign in to sync' })
    await expect(
      dialog.getByRole('button', { name: 'Sign in with Google' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Sign in with Microsoft' }),
    ).toBeVisible()
    await expect(dialog.getByRole('textbox', { name: 'Email' })).toBeVisible()
  }

  async emailLink({ email, sent }: { email: string; sent: boolean }) {
    await this.page.route('**/auth/v1/otp**', (route) =>
      sent
        ? route.fulfill({ status: 200, json: {} })
        : route.fulfill({ status: 429, json: { msg: 'rate limited' } }),
    )
    const dialog = this.page.getByRole('dialog', { name: 'Sign in to sync' })
    await dialog.getByRole('textbox', { name: 'Email' }).fill(email)
    await dialog.getByRole('button', { name: 'Email me a link' }).click()
  }

  async expectCodeStep(email: string) {
    const dialog = this.page.getByRole('dialog', { name: 'Check your email' })
    await expect(dialog.getByText(email)).toBeVisible()
    await expect(dialog.getByRole('textbox', { name: 'Code' })).toBeVisible()
  }

  async expectEmailFailed() {
    await expect(this.page.getByRole('alert')).toHaveText(
      "We couldn't send the email. Try again in a minute.",
    )
  }

  async enterCode({ code, accepted }: { code: string; accepted: boolean }) {
    await this.page.route('**/auth/v1/verify**', (route) =>
      accepted
        ? route.fulfill({ status: 200, json: {} })
        : route.fulfill({ status: 403, json: { msg: 'Token has expired' } }),
    )
    const dialog = this.page.getByRole('dialog', { name: 'Check your email' })
    await dialog.getByRole('textbox', { name: 'Code' }).fill(code)
    await dialog.getByRole('button', { name: 'Sign in' }).click()
  }

  async expectCodeFailed() {
    await expect(this.page.getByRole('alert')).toHaveText(
      "That code didn't work. Check it, or send a new one.",
    )
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click()
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  }
}
