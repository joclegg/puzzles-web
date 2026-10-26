import { describe, expect, it } from 'vitest'

import { DOT, REASON } from '@/common/sightlines/sightlines.constants'
import { parseGrid } from '@/common/sightlines/sightlinesGrid.functions'
import { nextDeduction } from '@/common/sightlines/sightlinesSolver.functions'

describe('nextDeduction', () => {
  it.each([
    ['BB.. .... .... ....', [[0, 1]], [4, 2], DOT.RED, REASON.SATISFIED],
    ['B.B. B... .... ....', [[0, 2]], [1], DOT.RED, REASON.TOO_MANY],
    ['B... R... .... ....', [[0, 3]], [1], DOT.BLUE, REASON.NEEDS],
    ['.R.. R... .... ....', [], [0], DOT.RED, REASON.ALONE],
  ] as const)(
    'finds the next step in %s',
    (text, numbers, cells, dot, reason) => {
      const deduction = nextDeduction({
        grid: parseGrid({ size: 4, text }),
        numbers: new Map(numbers.map(([cell, number]) => [cell, number])),
      })

      expect(deduction).toEqual({ cells, dot, reason, source: 0 })
    },
  )
})
