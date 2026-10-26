import type {
  DIFFICULTY,
  ENTRY_PROBLEM,
  GAME_MODE,
  HIGHLIGHT,
  HIGHLIGHT_STYLE,
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/sudoku/sudoku.constants'

export interface Cage {
  cells: number[]
  sum: number
}

export interface CellChange {
  cell: number
  value: number
  notes: number
}

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY]

export type EntryProblem = (typeof ENTRY_PROBLEM)[keyof typeof ENTRY_PROBLEM]

export type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE]

export interface Grid {
  size: number
  boxRows: number
  boxCols: number
  cells: number
  allDigits: number
  rowOf: number[]
  colOf: number[]
  boxOf: number[]
  rows: number[][]
  cols: number[][]
  boxes: number[][]
  houses: number[][]
  peers: number[][]
}

export type Highlight = (typeof HIGHLIGHT)[keyof typeof HIGHLIGHT]

export type HighlightStyle =
  (typeof HIGHLIGHT_STYLE)[keyof typeof HIGHLIGHT_STYLE]

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export type MistakeCheck = (typeof MISTAKE_CHECK)[keyof typeof MISTAKE_CHECK]

export interface PlayOptions {
  highlightHouses: boolean
  highlightCage: boolean
  sameNumberStyle: HighlightStyle
  notesStyle: HighlightStyle
  autoRemoveNotes: boolean
  highlightLastPlaced: boolean
}

export interface Puzzle {
  givens: number[]
  solution: number[] | null
  cages: Cage[]
  grid: Grid
  cageIndexByCell: number[]
}

export interface Rejection {
  cell: number
  clashes: Set<number>
}

export interface SudokuGame {
  puzzle: Puzzle
  values: number[]
  notes: number[]
  selected: number | null
  activeDigit: number | null
  inputMode: InputMode
  notesMode: boolean
  mistakeCheck: MistakeCheck
  mistakes: number
  undoStack: CellChange[][]
  redoStack: CellChange[][]
  options: PlayOptions
  rejected: Rejection | null
  eraserActive: boolean
  lastPlaced: number | null
  marked: Set<number>
  markActive: boolean
}
