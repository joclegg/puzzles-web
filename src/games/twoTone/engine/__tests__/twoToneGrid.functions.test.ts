import { describe, expect, it } from 'vitest'

import {
  brokenCells,
  hasBrokenRule,
  parseGrid,
} from '@/games/twoTone/engine/twoToneGrid.functions'

describe('brokenCells', () => {
  it.each([
    ['RRR. .... .... ....', [0, 1, 2]],
    ['R... R... R... ....', [0, 4, 8]],
    ['RRBB BBRR RRBB ....', [0, 1, 2, 3, 8, 9, 10, 11]],
    ['RBRR .... .... ....', [0, 2, 3]],
    ['RB.. BR.. .... ....', []],
  ])('lists only the tiles breaking a rule in %s', (text, broken) => {
    const cells = brokenCells(parseGrid({ size: 4, text }))

    expect([...cells].sort((a, b) => a - b)).toEqual(broken)
  })
})

describe('hasBrokenRule', () => {
  it.each([
    ['RRR. .... .... ....', true],
    ['RBRR .... .... ....', true],
    ['RB.. BR.. .... ....', false],
  ])('spots a broken rule in %s', (text, broken) => {
    expect(hasBrokenRule(parseGrid({ size: 4, text }))).toBe(broken)
  })
})
