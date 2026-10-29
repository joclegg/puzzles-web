import { epochDay } from '@/common/date.functions'
import { createRandom } from '@/common/random.functions'
import { DAILY_SEED_LINES } from '@/common/solitaire/solitaireBank.constants'

export function dailyWinnableSeed({
  seeds,
  date,
}: {
  seeds: bigint[]
  date: string
}): bigint {
  const count = Math.min(DAILY_SEED_LINES, seeds.length)
  const day = epochDay(date)
  return seeds[((day % count) + count) % count]
}

export function parseSeeds(text: string): bigint[] {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => BigInt(line.trim()))
}

export function randomWinnableSeed({
  seeds,
  seed,
}: {
  seeds: bigint[]
  seed: bigint
}): bigint {
  return seeds[createRandom(seed).nextIntBelow(seeds.length)]
}
