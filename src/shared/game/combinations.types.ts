import type { COMBINATION_ORDER } from '@/shared/game/combinations.constants'

export interface CombinationDigit {
  digit: number
  placed: boolean
}

export interface CombinationLine {
  label: string
  options: CombinationDigit[][]
}

export type CombinationOrder =
  (typeof COMBINATION_ORDER)[keyof typeof COMBINATION_ORDER]
