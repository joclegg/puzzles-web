import { bankLines } from '@/shared/bank/bank.functions'
import { epochDay } from '@/shared/lib/date.functions'
import { createRandom } from '@/shared/lib/random.functions'
import { DAILY_SEED_LINES } from '@/games/solitaire/engine/solitaire.constants'

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
  return bankLines(text).map((line) => BigInt(line.trim()))
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
