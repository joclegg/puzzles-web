import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import { INPUT_MODE, MISTAKE_CHECK } from '@/common/kakuro/kakuro.constants'
import type { KakuroSettings } from '@/common/kakuro/kakuroSettings.types'

export const GAMES_KEY = 'kakuro.games'

export const SETTINGS_KEY = 'kakuro.settings'

export const DEFAULT_SETTINGS: KakuroSettings = {
  ...DEFAULT_ASSISTS,
  inputMode: INPUT_MODE.CELL_FIRST,
  mistakeCheck: MISTAKE_CHECK.SHOW_WRONG,
  showMistakeCount: true,
  autoRemoveNotes: true,
  highlightRuns: true,
  showTimer: true,
  showCombinations: false,
  greyUsedDigits: true,
}

export const TITLE = 'Kakuro'
