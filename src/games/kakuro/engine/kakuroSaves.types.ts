import type { Assists } from '@/shared/game/assists.types'
import type {
  CombinationOrder,
  InputMode,
  MistakeCheck,
} from '@/games/kakuro/engine/kakuro.types'

export interface KakuroSettings extends Assists {
  inputMode: InputMode
  mistakeCheck: MistakeCheck
  showMistakeCount: boolean
  autoRemoveNotes: boolean
  highlightRuns: boolean
  showTimer: boolean
  showCombinations: boolean
  combinationOrder: CombinationOrder
  greyUsedDigits: boolean
}
