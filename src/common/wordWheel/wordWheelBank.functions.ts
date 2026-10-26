import { daysBetween } from '@/common/date.functions'
import { createRandom, shuffled } from '@/common/random.functions'
import { FIRST_DAY, LEVELS } from '@/common/wordWheel/wordWheel.constants'
import type { Level } from '@/common/wordWheel/wordWheel.types'

export function bankLines(text: string): string[] {
  return text.split('\n').filter((line) => line.trim().length > 0)
}

export function dailyIndex({
  count,
  level,
  date,
}: {
  count: number
  level: Level
  date: string
}): number {
  const order = shuffled({
    items: Array.from({ length: count }, (_, i) => i),
    random: createRandom(LEVELS.indexOf(level)),
  })
  const day = daysBetween({ from: FIRST_DAY, to: date })
  return order[((day % count) + count) % count]
}

export function randomIndex({ count, seed }: { count: number; seed: bigint }) {
  return createRandom(seed).nextIntBelow(count)
}
