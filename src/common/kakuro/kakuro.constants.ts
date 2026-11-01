import type {
  CombinationOrder,
  InputMode,
  MistakeCheck,
} from '@/common/kakuro/kakuro.types'

export const SIZES = [6, 8, 10, 12]

export const MAX_DIGIT = 9

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const FIRST_DAY = '2026-10-25'

export const COMBINATION_ORDER = {
  INCREASING: 'increasing',
  DECREASING: 'decreasing',
} as const

export const INPUT_MODE = {
  CELL_FIRST: 'cellFirst',
  DIGIT_FIRST: 'digitFirst',
} as const

export const MISTAKE_CHECK = {
  OFF: 'off',
  BLOCK_CLASHES: 'blockClashes',
  SHOW_WRONG: 'showWrong',
} as const

export const COMBINATION_ORDER_LABEL: Record<CombinationOrder, string> = {
  [COMBINATION_ORDER.INCREASING]: 'Increasing',
  [COMBINATION_ORDER.DECREASING]: 'Decreasing',
}

export const INPUT_MODE_LABEL: Record<InputMode, string> = {
  [INPUT_MODE.CELL_FIRST]: 'Cell first',
  [INPUT_MODE.DIGIT_FIRST]: 'Number first',
}

export const MISTAKE_CHECK_LABEL: Record<MistakeCheck, string> = {
  [MISTAKE_CHECK.OFF]: 'Off',
  [MISTAKE_CHECK.BLOCK_CLASHES]: 'Block clashes',
  [MISTAKE_CHECK.SHOW_WRONG]: 'Show wrong',
}
