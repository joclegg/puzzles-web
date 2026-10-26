import type {
  DOT,
  HINT_KIND,
  REASON,
} from '@/common/sightlines/sightlines.constants'

export interface Change {
  cell: number
  from: Dot
  to: Dot
}

export interface Deduction {
  cells: number[]
  dot: Dot
  reason: Reason
  source: number
}

export interface Direction {
  rowStep: number
  colStep: number
}

export type Dot = (typeof DOT)[keyof typeof DOT]

export interface Grid {
  size: number
  dots: string
}

export interface Hint {
  kind: HintKind
  cells: number[]
  deduction: Deduction | null
}

export type HintKind = (typeof HINT_KIND)[keyof typeof HINT_KIND]

export interface Puzzle {
  solution: Grid
  numbers: Map<number, number>
  walls: Set<number>
}

export type Reason = (typeof REASON)[keyof typeof REASON]

export interface SightlinesGame {
  puzzle: Puzzle
  grid: Grid
  changes: Change[]
  hint: Hint | null
}
