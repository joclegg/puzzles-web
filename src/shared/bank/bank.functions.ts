import { daysBetween } from '@/shared/lib/date.functions'
import { createRandom, shuffled } from '@/shared/lib/random.functions'

export function bankLines(text: string): string[] {
  return text.split('\n').filter((line) => line.trim().length > 0)
}

export function dailyIndex({
  count,
  orderSeed,
  firstDay,
  date,
}: {
  count: number
  orderSeed: number
  firstDay: string
  date: string
}): number {
  const order = shuffled({
    items: Array.from({ length: count }, (_, i) => i),
    random: createRandom(orderSeed),
  })
  const day = daysBetween({ from: firstDay, to: date })
  return order[((day % count) + count) % count]
}

export function randomIndex({ count, seed }: { count: number; seed: bigint }) {
  return createRandom(seed).nextIntBelow(count)
}
