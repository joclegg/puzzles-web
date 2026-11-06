import type { Assists } from '@/shared/game/assists.types'
import type {
  InputMode,
  MistakeCheck,
} from '@/games/kakuro/engine/kakuro.types'
import type { CombinationOrder } from '@/shared/game/combinations.types'

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
