import { describe, expect, it } from 'vitest'

import { REASON, TILE } from '@/games/twoTone/engine/twoTone.constants'
import {
  emptyGrid,
  parseGrid,
} from '@/games/twoTone/engine/twoToneGrid.functions'
import { nextDeduction } from '@/games/twoTone/engine/twoToneSolver.functions'

describe('nextDeduction', () => {
  it.each([
    ['RR.. ........ ....', 2, TILE.BLUE, REASON.PAIR],
    ['.BB. ........ ....', 0, TILE.RED, REASON.PAIR],
    ['R.R. ........ ....', 1, TILE.BLUE, REASON.GAP],
    ['RB.R ........ ....', 2, TILE.BLUE, REASON.BALANCE],
  ])('finds the forced tile in %s', (text, cell, tile, reason) => {
    const deduction = nextDeduction(parseGrid({ size: 4, text }))

    expect([deduction?.cells[0], deduction?.tile, deduction?.reason]).toEqual([
      cell,
      tile,
      reason,
    ])
  })

  it('fills a row the other way round when it would copy a full row', () => {
    const grid = parseGrid({
      size: 6,
      text: 'RBBRBR ...... ...... ...... ...... R.BRB.',
    })

    const deduction = nextDeduction(grid)

    expect([deduction?.cells, deduction?.tile, deduction?.reason]).toEqual([
      [31],
      TILE.RED,
      REASON.UNIQUE,
    ])
    expect(deduction?.twin).toEqual({ isRow: true, index: 0 })
  })

  it('finds nothing in an empty grid', () => {
    expect(nextDeduction(emptyGrid(4))).toBeNull()
  })
})
