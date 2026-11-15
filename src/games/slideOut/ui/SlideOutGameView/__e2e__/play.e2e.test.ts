import { expect, test } from '@e2e/playwrightExtensions'

const BEGINNER = '4;212H,313H,142H,022H,402V,103H,242V,132V,542H,513H'

const DAILY_BEGINNER = [
  { block: 1, steps: -1 },
  { block: 6, steps: 1 },
  { block: 7, steps: 2 },
  { block: 0, steps: 3 },
]

test('frees the red block in the daily beginner puzzle at par', async ({
  slideOutPage,
}) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')

  for (const move of DAILY_BEGINNER) {
    await slideOutPage.slideBy(move)
  }

  await expect(slideOutPage.dialog).toContainText('4 moves, par!')
})

test('goes back to Slide Out home, not the solved puzzle', async ({
  slideOutPage,
}) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')
  for (const move of DAILY_BEGINNER) {
    await slideOutPage.slideBy(move)
  }
  await slideOutPage.goHomeFromDialog()

  await slideOutPage.browserBack()

  await expect(slideOutPage.board).toBeHidden()
})

test(
  'slides a block by dragging it',
  { tag: '@desktop' },
  async ({ slideOutPage }) => {
    await slideOutPage.useBank({
      path: 'slideout/beginner.txt',
      lines: [BEGINNER],
    })
    await slideOutPage.openDaily('Beginner')

    await slideOutPage.dragBy({ block: 0, cells: -1 })

    await slideOutPage.expectBlock({ block: 0, at: /column 1/ })
  },
)

test('undoes a slide', async ({ slideOutPage }) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')
  await slideOutPage.slideBy({ block: 0, steps: -1 })

  await slideOutPage.undo()

  await slideOutPage.expectBlock({ block: 0, at: /column 2/ })
})

test('highlights the block to move as a hint', async ({ slideOutPage }) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')

  await slideOutPage.hint()

  await slideOutPage.expectBlock({ block: 1, at: /, hint$/ })
  await slideOutPage.expectScreenshot('hint')
})

test('keeps progress after a reload', async ({ slideOutPage }) => {
  await slideOutPage.useBank({
    path: 'slideout/beginner.txt',
    lines: [BEGINNER],
  })
  await slideOutPage.openDaily('Beginner')
  await slideOutPage.slideBy({ block: 0, steps: -1 })

  await slideOutPage.reload()

  await slideOutPage.expectBlock({ block: 0, at: /column 1/ })
})
