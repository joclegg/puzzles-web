import { daysBetween } from '@/common/date.functions'
import { FIRST_DAY } from '@/common/kakuro/kakuro.constants'
import { createRandom, shuffled } from '@/common/random.functions'

export function bankLines(text: string): string[] {
  return text.split('\n').filter((line) => line.trim().length > 0)
}

export function dailyIndex({
  count,
  size,
  date,
}: {
  count: number
  size: number
  date: string
}): number {
  const order = shuffled({
    items: Array.from({ length: count }, (_, i) => i),
    random: createRandom(size),
  })
  const day = daysBetween({ from: FIRST_DAY, to: date })
  return order[((day % count) + count) % count]
}

export function randomIndex({ count, seed }: { count: number; seed: bigint }) {
  return createRandom(seed).nextIntBelow(count)
}
