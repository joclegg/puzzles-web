import type { HINT_STYLE } from '@/common/assists.constants'

export interface Assists {
  showHints: boolean
  showTutorial: boolean
  allowReveal: boolean
  hintStyle: HintStyle
}

export type HintStyle = (typeof HINT_STYLE)[keyof typeof HINT_STYLE]

export interface TutorialStep {
  target: string
  text: string
}
