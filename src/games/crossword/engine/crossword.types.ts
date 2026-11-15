export interface Change {
  cell: number
  from: string
  to: string
}

export interface CrosswordGame {
  puzzle: Puzzle
  entries: string[]
  changes: Change[]
  undone: Change[]
  selected: number
  isAcross: boolean
  skipFilledCells: boolean
  hints: number
  mistakes: number
  showMistakes: boolean
  jumpedFrom: Cursor | null
}

export interface CrosswordHint {
  cell: number
  letter: string
  message: string
}

export interface Puzzle {
  size: number
  solution: string[]
  isWhite: boolean[]
  numbers: Map<number, number>
  words: Word[]
}

export interface Word {
  number: number
  isAcross: boolean
  cells: number[]
  answer: string
}

interface Cursor {
  cell: number
  isAcross: boolean
}
