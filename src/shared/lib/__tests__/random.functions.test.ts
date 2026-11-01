import { describe, expect, it } from 'vitest'

import {
  createRandom,
  createRandomFromInt,
  shuffled,
} from '@/shared/lib/random.functions'

describe('createRandom', () => {
  it('draws the expected ints for seed 5', () => {
    const random = createRandom(5)

    const ints = Array.from({ length: 5 }, () => random.nextInt())

    expect(ints).toEqual([
      -1350163013, -332731564, -1136814308, 112964028, -189288304,
    ])
  })

  it('draws the expected bounded ints, booleans, doubles and longs', () => {
    const random = createRandom(5)
    Array.from({ length: 5 }, () => random.nextInt())

    const bounded = [
      ...[10, 10, 10, 10, 10, 16, 16, 16, 944, 944, 944].map((until) =>
        random.nextIntBelow(until),
      ),
    ]

    expect(bounded).toEqual([6, 6, 2, 9, 1, 12, 3, 5, 434, 538, 519])
    expect(random.nextBoolean()).toBe(true)
    expect(random.nextDouble()).toBe(0.6887307394539274)
    expect(random.nextLong()).toBe(-4646269696292941719n)
  })

  it('draws the expected values for a negative seed', () => {
    const random = createRandom(-1234567890123n)

    expect(random.nextInt()).toBe(620466060)
    expect(random.nextLong()).toBe(8642092452079381161n)
  })
})

describe('createRandomFromInt', () => {
  it('draws the expected values for int seed 7', () => {
    const random = createRandomFromInt(7)

    expect(random.nextInt()).toBe(-182312124)
    expect(random.nextIntBelow(100)).toBe(89)
  })
})

describe('shuffled', () => {
  it('keeps every item', () => {
    const items = [1, 2, 3, 4, 5]

    const result = shuffled({ items, random: createRandom(1) })

    expect([...result].sort()).toEqual(items)
  })
})
