import type { InputMode, MistakeCheck } from '@/common/kakuro/kakuro.types'

export interface KakuroSettings {
  inputMode: InputMode
  mistakeCheck: MistakeCheck
  showMistakeCount: boolean
  autoRemoveNotes: boolean
  highlightRuns: boolean
  showTimer: boolean
  showCombinations: boolean
  greyUsedDigits: boolean
}
