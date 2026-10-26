import type {
  HINT_KIND,
  REASON,
  TILE,
} from '@/common/twoTone/twoTone.constants'

export interface Change {
  cell: number
  from: Tile
  to: Tile
}

export interface Deduction {
  cells: number[]
  tile: Tile
  reason: Reason
  line: Line
}

export interface Grid {
  size: number
  tiles: string
}

export interface Hint {
  kind: HintKind
  cells: number[]
  deduction: Deduction | null
}

export type HintKind = (typeof HINT_KIND)[keyof typeof HINT_KIND]

export interface Line {
  isRow: boolean
  index: number
}

export interface Puzzle {
  givens: Grid
  solution: Grid
}

export type Reason = (typeof REASON)[keyof typeof REASON]

export type Tile = (typeof TILE)[keyof typeof TILE]

export interface TwoToneGame {
  puzzle: Puzzle
  grid: Grid
  changes: Change[]
  hint: Hint | null
}
