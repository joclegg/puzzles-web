import type { CombinationOrder } from '@/shared/game/combinations.types'

export const COMBINATION_ORDER = {
  INCREASING: 'increasing',
  DECREASING: 'decreasing',
} as const

export const COMBINATION_ORDER_LABEL: Record<CombinationOrder, string> = {
  [COMBINATION_ORDER.INCREASING]: 'Increasing',
  [COMBINATION_ORDER.DECREASING]: 'Decreasing',
}
