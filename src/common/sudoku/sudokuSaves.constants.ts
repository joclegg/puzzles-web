import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import {
  HIGHLIGHT_STYLE,
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/sudoku/sudoku.constants'
import type {
  DigitCounts,
  ModeSettings,
  SudokuSettings,
} from '@/common/sudoku/sudokuSaves.types'

export const GAMES_KEY = 'sudoku.games'

export const SETTINGS_KEY = 'sudoku.settings'

export const SUDOKU_STATUS = {
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  REVEALED: 'revealed',
} as const

export const SUDOKU_STATUS_LABEL = {
  [SUDOKU_STATUS.IN_PROGRESS]: 'In progress',
  [SUDOKU_STATUS.COMPLETED]: 'Solved',
  [SUDOKU_STATUS.ABANDONED]: 'Abandoned',
  [SUDOKU_STATUS.REVEALED]: 'Solution shown',
}

export const DIGIT_COUNTS = {
  COUNT_UP: 'countUp',
  COUNT_DOWN: 'countDown',
  OFF: 'off',
} as const

export const DIGIT_COUNTS_LABEL: Record<DigitCounts, string> = {
  [DIGIT_COUNTS.COUNT_UP]: 'Count up',
  [DIGIT_COUNTS.COUNT_DOWN]: 'Count down',
  [DIGIT_COUNTS.OFF]: 'Off',
}

export const DEFAULT_MODE_SETTINGS: ModeSettings = {
  mistakeCheck: MISTAKE_CHECK.SHOW_WRONG,
  showMistakeCount: true,
  highlightHouses: true,
  highlightCage: true,
  sameNumberStyle: HIGHLIGHT_STYLE.CELL,
  notesStyle: HIGHLIGHT_STYLE.CELL,
  autoRemoveNotes: true,
  digitCounts: DIGIT_COUNTS.COUNT_UP,
  disableCompletedDigits: true,
  showTimer: true,
  boldPlacedDigits: true,
  highlightLastPlaced: true,
  greyGivenCells: true,
}

export const DEFAULT_SETTINGS: SudokuSettings = {
  ...DEFAULT_ASSISTS,
  inputMode: INPUT_MODE.CELL_FIRST,
  classic: DEFAULT_MODE_SETTINGS,
  killer: { ...DEFAULT_MODE_SETTINGS, greyGivenCells: false },
  pastBests: [],
}

export const TITLE = 'Sudoku'
