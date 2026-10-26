import { expect, test } from '@e2e/playwrightExtensions'

const DAILY_BEGINNER = [
  { block: 0, steps: 1 },
  { block: 4, steps: 1 },
  { block: 8, steps: 2 },
  { block: 6, steps: -1 },
  { block: 5, steps: -1 },
  { block: 1, steps: -2 },
  { block: 0, steps: 3 },
]

test('frees the red block in the daily beginner puzzle at par', async ({
  slideOutPage,
}) => {
  await slideOutPage.openDaily('Beginner')
  await slideOutPage.expectScreenshot('daily-start')

  for (const move of DAILY_BEGINNER) {
    await slideOutPage.slideBy(move)
  }

  await expect(slideOutPage.dialog).toContainText('7 moves, par!')
  await slideOutPage.expectScreenshot('daily-solved')
})

test(
  'slides a block by dragging it',
  { tag: '@desktop' },
  async ({ slideOutPage }) => {
    await slideOutPage.openDaily('Beginner')

    await slideOutPage.dragBy({ block: 0, cells: 1 })

    await slideOutPage.expectBlock({ block: 0, at: /column 2/ })
  },
)

test('undoes a slide', async ({ slideOutPage }) => {
  await slideOutPage.openDaily('Beginner')
  await slideOutPage.slideBy({ block: 0, steps: 1 })

  await slideOutPage.undo()

  await slideOutPage.expectBlock({ block: 0, at: /column 1/ })
})

test('highlights the block to move as a hint', async ({ slideOutPage }) => {
  await slideOutPage.openDaily('Beginner')

  await slideOutPage.hint()

  await slideOutPage.expectBlock({ block: 0, at: /, hint$/ })
  await slideOutPage.expectScreenshot('hint')
})

test('keeps progress after a reload', async ({ slideOutPage }) => {
  await slideOutPage.openDaily('Beginner')
  await slideOutPage.slideBy({ block: 0, steps: 1 })

  await slideOutPage.reload()

  await slideOutPage.expectBlock({ block: 0, at: /column 2/ })
})
