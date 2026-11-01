import type { Assists } from '@/shared/game/assists.types'
import type {
  Difficulty,
  GameMode,
  HighlightStyle,
  InputMode,
  MistakeCheck,
} from '@/games/sudoku/engine/sudoku.types'
import type {
  DIGIT_COUNTS,
  SUDOKU_STATUS,
} from '@/games/sudoku/engine/sudokuSaves.constants'

export interface BestTime {
  mode: GameMode
  difficulty: Difficulty
  bestMs: number | null
  averageMs: number | null
  completed: number
}

export type DigitCounts = (typeof DIGIT_COUNTS)[keyof typeof DIGIT_COUNTS]

export interface ModeSettings extends Assists {
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

export interface PastBest {
  mode: GameMode
  difficulty: Difficulty
  bestMs: number
}

export interface SavedSudoku {
  id: string
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
  pastBests: PastBest[]
}

export type SudokuStatus = (typeof SUDOKU_STATUS)[keyof typeof SUDOKU_STATUS]
