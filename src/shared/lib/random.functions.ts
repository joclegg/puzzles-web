import type { Random } from '@/shared/lib/random.types'

const ADDEND_STEP = 362437

const WARM_UP_ROUNDS = 64

export function createRandom(seed: bigint | number): Random {
  const big = BigInt(seed)
  const low = Number(BigInt.asIntN(32, big))
  const high = Number(BigInt.asIntN(32, big >> 32n))
  return xorWow({ seed1: low, seed2: high })
}

export function createRandomFromInt(seed: number): Random {
  return xorWow({ seed1: seed | 0, seed2: (seed | 0) >> 31 })
}

export function newSeed(): bigint {
  const [value] = crypto.getRandomValues(new BigInt64Array(1))
  return value
}

export function randomItem<T>({
  items,
  random,
}: {
  items: readonly T[]
  random: Random
}): T {
  return items[random.nextIntBelow(items.length)]
}

export function shuffled<T>({
  items,
  random,
}: {
  items: readonly T[]
  random: Random
}): T[] {
  const result = [...items]
  for (let i = result.length - 1; i >= 1; i--) {
    const j = random.nextIntBelow(i + 1)
    const swap = result[i]
    result[i] = result[j]
    result[j] = swap
  }
  return result
}

function xorWow({ seed1, seed2 }: { seed1: number; seed2: number }): Random {
  let x = seed1
  let y = seed2
  let z = 0
  let w = 0
  let v = ~seed1
  let addend = (seed1 << 10) ^ (seed2 >>> 4)

  function nextInt(): number {
    let t = x
    t = t ^ (t >>> 2)
    x = y
    y = z
    z = w
    const v0 = v
    w = v0
    t = t ^ (t << 1) ^ v0 ^ (v0 << 4)
    v = t
    addend = (addend + ADDEND_STEP) | 0
    return (t + addend) | 0
  }

  function nextBits(bitCount: number): number {
    return (nextInt() >>> (32 - bitCount)) & (-bitCount >> 31)
  }

  function nextIntBelow(until: number): number {
    if (until <= 0) {
      throw new RangeError(`until must be positive, was ${until}`)
    }
    if ((until & -until) === until) {
      return nextBits(31 - Math.clz32(until))
    }
    for (;;) {
      const bits = nextInt() >>> 1
      const value = bits % until
      if (((bits - value + (until - 1)) | 0) >= 0) {
        return value
      }
    }
  }

  function nextIntBetween({ from, until }: { from: number; until: number }) {
    return from + nextIntBelow(until - from)
  }

  function nextLong(): bigint {
    const high = BigInt(nextInt())
    const low = BigInt(nextInt())
    return BigInt.asIntN(64, (high << 32n) + low)
  }

  function nextDouble(): number {
    const high = nextBits(26)
    const low = nextBits(27)
    return (high * 2 ** 27 + low) / 2 ** 53
  }

  function nextBoolean(): boolean {
    return nextBits(1) !== 0
  }

  if ((x | y | z | w | v) === 0) {
    throw new RangeError(
      'Initial state must have at least one non-zero element',
    )
  }
  for (let i = 0; i < WARM_UP_ROUNDS; i++) {
    nextInt()
  }

  return {
    nextInt,
    nextIntBelow,
    nextIntBetween,
    nextLong,
    nextDouble,
    nextBoolean,
  }
}
