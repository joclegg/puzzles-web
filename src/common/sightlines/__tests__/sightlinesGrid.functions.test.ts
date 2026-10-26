import { describe, expect, it } from 'vitest'

import {
  parseGrid,
  seenAll,
  totalReach,
} from '@/common/sightlines/sightlinesGrid.functions'

describe('seenAll and totalReach', () => {
  it.each([
    ['BBB. .... .... ....', 0, 2, 6],
    ['BBRB B... B... R...', 0, 3, 3],
    ['BRBB .... .... ....', 0, 0, 3],
    ['B... B... B... B...', 5, 1, 6],
  ])(
    'looks along the row and column of %s from cell %i',
    (text, cell, seen, reach) => {
      const grid = parseGrid({ size: 4, text })

      expect([seenAll({ grid, cell }), totalReach({ grid, cell })]).toEqual([
        seen,
        reach,
      ])
    },
  )
})
