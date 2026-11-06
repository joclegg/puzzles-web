import { COMBINATION_ORDER } from '@/shared/game/combinations.constants'
import type {
  CombinationDigit,
  CombinationOrder,
} from '@/shared/game/combinations.types'

const MAX_DIGIT = 9

const DIGITS = Array.from({ length: MAX_DIGIT }, (_, index) => index + 1)

const MASKS_BY_RUN = groupMasks()

export function bit(digit: number): number {
  return 1 << (digit - 1)
}

export function combinationOptions({
  masks,
  placed,
  order,
}: {
  masks: number[]
  placed: number
  order: CombinationOrder
}): CombinationDigit[][] {
  const direction = order === COMBINATION_ORDER.DECREASING ? -1 : 1
  return masks
    .map((mask) =>
      digitsOf(mask)
        .sort((a, b) => (a - b) * direction)
        .map((digit) => ({ digit, placed: (placed & bit(digit)) !== 0 })),
    )
    .sort(
      (a, b) =>
        compareDigits({
          a: a.map((it) => it.digit),
          b: b.map((it) => it.digit),
        }) * direction,
    )
}

export function digitsOf(mask: number): number[] {
  return DIGITS.filter((digit) => (mask & bit(digit)) !== 0)
}

export function masksFor({ length, sum }: { length: number; sum: number }) {
  return MASKS_BY_RUN.get(`${length}:${sum}`) ?? []
}

function bitCount(mask: number): number {
  let count = 0
  for (let rest = mask; rest !== 0; rest &= rest - 1) {
    count++
  }
  return count
}

function compareDigits({ a, b }: { a: number[]; b: number[] }): number {
  const index = a.findIndex((digit, at) => digit !== b[at])
  return index === -1 ? a.length - b.length : a[index] - b[index]
}

function groupMasks(): Map<string, number[]> {
  const groups = new Map<string, number[]>()
  for (let mask = 1; mask < 1 << MAX_DIGIT; mask++) {
    const sum = digitsOf(mask).reduce((total, digit) => total + digit, 0)
    const key = `${bitCount(mask)}:${sum}`
    groups.set(key, [...(groups.get(key) ?? []), mask])
  }
  return groups
}
