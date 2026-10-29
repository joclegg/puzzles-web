import { describe, expect, it } from 'vitest'

import {
  dailyWinnableSeed,
  parseSeeds,
  randomWinnableSeed,
} from '@/common/solitaire/solitaireBank.functions'

const SEEDS = parseSeeds('11\n-22\n33\n')

describe('parseSeeds', () => {
  it('reads one signed seed per line', () => {
    expect(SEEDS).toEqual([11n, -22n, 33n])
  })
})

describe('dailyWinnableSeed', () => {
  it('steps through the bank one line a day', () => {
    expect([
      dailyWinnableSeed({ seeds: SEEDS, date: '1970-01-01' }),
      dailyWinnableSeed({ seeds: SEEDS, date: '1970-01-02' }),
      dailyWinnableSeed({ seeds: SEEDS, date: '1970-01-04' }),
    ]).toEqual([11n, -22n, 11n])
  })
})

describe('randomWinnableSeed', () => {
  it('picks a line from the bank', () => {
    expect(SEEDS).toContain(randomWinnableSeed({ seeds: SEEDS, seed: 7n }))
  })
})
