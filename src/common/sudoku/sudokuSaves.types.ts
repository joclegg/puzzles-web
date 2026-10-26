import type { Assists } from '@/common/assists.types'
import type {
  Difficulty,
  GameMode,
  HighlightStyle,
  InputMode,
  MistakeCheck,
} from '@/common/sudoku/sudoku.types'
import type {
  DAILY_STATUS,
  DIGIT_COUNTS,
  MEDAL,
  SUDOKU_STATUS,
} from '@/common/sudoku/sudokuSaves.constants'

export interface BestTime {
  mode: GameMode
  difficulty: Difficulty
  bestMs: number | null
  averageMs: number | null
  completed: number
}

export interface DailyDay {
  date: string
  statuses: Record<GameMode, DailyStatus>
  medal: Medal
  doneLate: boolean
}

export type DailyStatus = (typeof DAILY_STATUS)[keyof typeof DAILY_STATUS]

export type DigitCounts = (typeof DIGIT_COUNTS)[keyof typeof DIGIT_COUNTS]

export type Medal = (typeof MEDAL)[keyof typeof MEDAL]

export interface ModeSettings {
  mistakeCheck: MistakeCheck
  showMistakeCount: boolean
  highlightHouses: boolean
  highlightCage: boolean
  sameNumberStyle: HighlightStyle
  notesStyle: HighlightStyle
  autoRemoveNotes: boolean
  digitCounts: DigitCounts
  disableCompletedDigits: boolean
  showTimer: boolean
  boldPlacedDigits: boolean
  highlightLastPlaced: boolean
  greyGivenCells: boolean
}

export interface SavedSudoku {
  id: number
  puzzleId: string
  mode: GameMode
  difficulty: Difficulty | null
  custom: boolean
  puzzle: string
  values: string
  notes: number[]
  moves: string
  elapsedMs: number
  mistakes: number
  mistakeCheck: MistakeCheck
  status: SudokuStatus
  startedAt: number
  finishedAt: number | null
}

export interface SudokuRef {
  puzzleId: string
  mode: GameMode
  difficulty: Difficulty | null
  custom: boolean
  puzzle: string
}

export interface SudokuSettings extends Assists {
  inputMode: InputMode
  classic: ModeSettings
  killer: ModeSettings
}

export type SudokuStatus = (typeof SUDOKU_STATUS)[keyof typeof SUDOKU_STATUS]
