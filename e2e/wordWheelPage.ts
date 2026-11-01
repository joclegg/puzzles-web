import { expect, type Locator, type Page } from '@playwright/test'

export class WordWheelPage {
  readonly page: Page
  readonly crossword: Locator
  readonly letters: Locator
  readonly status: Locator
  readonly dialog: Locator
  readonly word: Locator
  readonly continueCard: Locator

  constructor(page: Page) {
    this.page = page
    this.crossword = page.getByRole('grid', { name: 'Crossword' })
    this.letters = page.getByRole('group', { name: 'Letters' })
    this.status = page.getByRole('status')
    this.dialog = page.getByRole('dialog')
    this.word = page.getByLabel('Word', { exact: true })
    this.continueCard = page.getByRole('button', { name: /^Continue/ })
  }

  async open() {
    await this.page.goto('./#/word-wheel')
    await expect(
      this.page.getByRole('heading', { name: 'Word Wheel' }),
    ).toBeVisible()
  }

  async openDaily(letters: number) {
    await this.page
      .getByRole('button', { name: `Daily ${letters} letters` })
      .click()
    await expect(this.letters).toBeVisible()
  }

  levelTile(letters: number) {
    return this.page.getByRole('button', {
      name: new RegExp(`^${letters} letters`),
    })
  }

  async startLevel(letters: number) {
    await this.levelTile(letters).click()
    await expect(this.letters).toBeVisible()
  }

  async goHome() {
    await this.dialog.getByRole('button', { name: 'Home' }).click()
    await expect(
      this.page.getByRole('heading', { name: 'Word Wheel' }),
    ).toBeVisible()
  }

  async showRules() {
    await this.page.getByRole('button', { name: 'Show the rules' }).click()
  }

  letter(name: string) {
    return this.letters.getByRole('button', { name: `Letter ${name}` }).first()
  }

  async typeWord(word: string) {
    await this.page.keyboard.type(word)
    await this.page.keyboard.press('Enter')
  }

  async tapWord(word: string) {
    for (const letter of word) {
      await this.letters
        .getByRole('button', { name: `Letter ${letter}`, pressed: false })
        .first()
        .click()
    }
    await this.page.getByRole('button', { name: 'Enter the word' }).click()
  }

  async swipeWord(word: string) {
    const centres = []
    const used = new Set<number>()
    for (const letter of word) {
      const all = this.letters.getByRole('button', { name: `Letter ${letter}` })
      const count = await all.count()
      for (let i = 0; i < count; i++) {
        const box = (await all.nth(i).boundingBox())!
        const key = Math.round(box.x * 1000 + box.y)
        if (!used.has(key)) {
          used.add(key)
          centres.push({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
          break
        }
      }
    }
    await this.page.mouse.move(centres[0].x, centres[0].y)
    await this.page.mouse.down()
    for (const centre of centres.slice(1)) {
      await this.page.mouse.move(centre.x, centre.y, { steps: 5 })
    }
    await this.page.mouse.up()
  }

  async showLetter() {
    await this.page.getByRole('button', { name: 'Show a letter' }).click()
  }

  async shuffle() {
    await this.page.getByRole('button', { name: 'Shuffle the letters' }).click()
  }

  async reload() {
    await this.page.reload()
  }

  async expectShownLetters(count: number) {
    await expect(
      this.crossword
        .getByRole('gridcell')
        .and(this.page.getByRole('gridcell', { name: /^[A-Z]$/ })),
    ).toHaveCount(count)
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [this.page.getByRole('heading', { level: 1 }).locator('+ p')],
    })
  }
}
