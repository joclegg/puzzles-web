import type { Assists } from '@/common/assists.types'

export const HINT_STYLE = {
  POINT: 'point',
  FILL: 'fill',
} as const

export const DEFAULT_ASSISTS: Assists = {
  showHints: false,
  showTutorial: true,
  allowReveal: false,
  hintStyle: HINT_STYLE.POINT,
}
