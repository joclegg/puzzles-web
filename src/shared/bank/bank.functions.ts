import { daysBetween } from '@/shared/lib/date.functions'
import { createRandom, shuffled } from '@/shared/lib/random.functions'

const DAILY_ORDERS = new Map<string, number[]>()

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
  const order = dailyOrder({ count, orderSeed })
  const day = daysBetween({ from: firstDay, to: date })
  return order[((day % count) + count) % count]
}

export function randomIndex({ count, seed }: { count: number; seed: bigint }) {
  return createRandom(seed).nextIntBelow(count)
}

function dailyOrder({
  count,
  orderSeed,
}: {
  count: number
  orderSeed: number
}) {
  const key = `${count}/${orderSeed}`
  const cached = DAILY_ORDERS.get(key)
  if (cached !== undefined) {
    return cached
  }
  const order = shuffled({
    items: Array.from({ length: count }, (_, i) => i),
    random: createRandom(orderSeed),
  })
  DAILY_ORDERS.set(key, order)
  return order
}
