import type {
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/kakuro/kakuro.constants'

export interface Change {
  cell: number
  fromValue: number
  fromNotes: number
  toValue: number
  toNotes: number
  clearedNotes: number[]
}

export interface CombinationDigit {
  digit: number
  placed: boolean
}

export interface CombinationLine {
  label: string
  options: CombinationDigit[][]
}

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface KakuroGame {
  puzzle: Puzzle
  values: number[]
  notes: number[]
  changes: Change[]
  selected: number | null
  notesMode: boolean
  inputMode: InputMode
  mistakeCheck: MistakeCheck
  activeDigit: number | null
  eraserActive: boolean
  mistakes: number
  rejected: number | null
  autoRemoveNotes: boolean
  undone: Change[]
  marked: Set<number>
  markActive: boolean
}

export interface KakuroHint {
  cell: number
  digit: number
  message: string
}

export type MistakeCheck = (typeof MISTAKE_CHECK)[keyof typeof MISTAKE_CHECK]

export interface Puzzle {
  size: number
  solution: number[]
  givens: Set<number>
  isWhite: boolean[]
  runs: Run[]
  runsOf: Map<number, Run[]>
  acrossClues: Map<number, number>
  downClues: Map<number, number>
}

export interface Run {
  cells: number[]
  sum: number
  isAcross: boolean
  clueCell: number
}
