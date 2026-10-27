import type { Assists } from '@/common/assists.types'
import type { InputMode, MistakeCheck } from '@/common/kakuro/kakuro.types'

export interface KakuroSettings extends Assists {
  inputMode: InputMode
  mistakeCheck: MistakeCheck
  showMistakeCount: boolean
  autoRemoveNotes: boolean
  highlightRuns: boolean
  showTimer: boolean
  showCombinations: boolean
  greyUsedDigits: boolean
}
