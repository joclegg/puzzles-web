import { HINT_STYLE } from '@/common/assists.constants'
import {
  DEFAULT_SETTINGS as FIVE_LETTERS_DEFAULTS,
  GAMES_KEY as FIVE_LETTERS_GAMES,
  SETTINGS_KEY as FIVE_LETTERS_SETTINGS,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import { MISTAKE_CHECK as KAKURO_MISTAKE_CHECK } from '@/common/kakuro/kakuro.constants'
import {
  DEFAULT_SETTINGS as KAKURO_DEFAULTS,
  GAMES_KEY as KAKURO_GAMES,
  SETTINGS_KEY as KAKURO_SETTINGS,
} from '@/common/kakuro/kakuroSettings.constants'
import {
  DEFAULT_SETTINGS as SIGHTLINES_DEFAULTS,
  GAMES_KEY as SIGHTLINES_GAMES,
  SETTINGS_KEY as SIGHTLINES_SETTINGS,
} from '@/common/sightlines/sightlinesSettings.constants'
import {
  DEFAULT_SETTINGS as SLIDE_OUT_DEFAULTS,
  GAMES_KEY as SLIDE_OUT_GAMES,
  SETTINGS_KEY as SLIDE_OUT_SETTINGS,
} from '@/common/slideOut/slideOutSaves.constants'
import {
  DEFAULT_SETTINGS as SOLITAIRE_DEFAULTS,
  GAMES_KEY as SOLITAIRE_GAMES,
  SETTINGS_KEY as SOLITAIRE_SETTINGS,
} from '@/common/solitaire/solitaireSaves.constants'
import {
  HIGHLIGHT_STYLE,
  MISTAKE_CHECK as SUDOKU_MISTAKE_CHECK,
} from '@/common/sudoku/sudoku.constants'
import {
  DEFAULT_SETTINGS as SUDOKU_DEFAULTS,
  DIGIT_COUNTS,
  GAMES_KEY as SUDOKU_GAMES,
  SETTINGS_KEY as SUDOKU_SETTINGS,
} from '@/common/sudoku/sudokuSaves.constants'
import {
  DEFAULT_SETTINGS as TWO_TONE_DEFAULTS,
  GAMES_KEY as TWO_TONE_GAMES,
  SETTINGS_KEY as TWO_TONE_SETTINGS,
} from '@/common/twoTone/twoToneSettings.constants'
import {
  DEFAULT_SETTINGS as WORD_WHEEL_DEFAULTS,
  GAMES_KEY as WORD_WHEEL_GAMES,
  SETTINGS_KEY as WORD_WHEEL_SETTINGS,
} from '@/common/wordWheel/wordWheelSaves.constants'

const LEGACY_ASSISTS = {
  showHints: true,
  showTutorial: true,
  allowReveal: true,
  hintStyle: HINT_STYLE.POINT,
}

const LEGACY_SUDOKU_MODE = {
  mistakeCheck: SUDOKU_MISTAKE_CHECK.SHOW_WRONG,
  showMistakeCount: true,
  highlightHouses: true,
  highlightCage: true,
  sameNumberStyle: HIGHLIGHT_STYLE.CELL,
  notesStyle: HIGHLIGHT_STYLE.CELL,
  autoRemoveNotes: true,
  digitCounts: DIGIT_COUNTS.COUNT_UP,
  disableCompletedDigits: true,
  highlightLastPlaced: true,
}

export const GAMES_KEYS = [
  SUDOKU_GAMES,
  SOLITAIRE_GAMES,
  TWO_TONE_GAMES,
  SIGHTLINES_GAMES,
  FIVE_LETTERS_GAMES,
  KAKURO_GAMES,
  SLIDE_OUT_GAMES,
  WORD_WHEEL_GAMES,
]

export const LEGACY_SETTINGS: Record<string, object> = {
  [SUDOKU_SETTINGS]: {
    ...SUDOKU_DEFAULTS,
    ...LEGACY_ASSISTS,
    classic: {
      ...SUDOKU_DEFAULTS.classic,
      ...LEGACY_ASSISTS,
      ...LEGACY_SUDOKU_MODE,
    },
    killer: {
      ...SUDOKU_DEFAULTS.killer,
      ...LEGACY_ASSISTS,
      ...LEGACY_SUDOKU_MODE,
    },
  },
  [SOLITAIRE_SETTINGS]: {
    ...SOLITAIRE_DEFAULTS,
    ...LEGACY_ASSISTS,
    warnUnwinnable: true,
  },
  [TWO_TONE_SETTINGS]: {
    ...TWO_TONE_DEFAULTS,
    ...LEGACY_ASSISTS,
    markBrokenRules: true,
    showProgress: true,
  },
  [SIGHTLINES_SETTINGS]: {
    ...SIGHTLINES_DEFAULTS,
    ...LEGACY_ASSISTS,
    markBrokenRules: true,
    showProgress: true,
  },
  [FIVE_LETTERS_SETTINGS]: { ...FIVE_LETTERS_DEFAULTS, ...LEGACY_ASSISTS },
  [KAKURO_SETTINGS]: {
    ...KAKURO_DEFAULTS,
    ...LEGACY_ASSISTS,
    mistakeCheck: KAKURO_MISTAKE_CHECK.SHOW_WRONG,
    showMistakeCount: true,
    autoRemoveNotes: true,
    highlightRuns: true,
    greyUsedDigits: true,
  },
  [SLIDE_OUT_SETTINGS]: { ...SLIDE_OUT_DEFAULTS, ...LEGACY_ASSISTS },
  [WORD_WHEEL_SETTINGS]: { ...WORD_WHEEL_DEFAULTS, ...LEGACY_ASSISTS },
}
