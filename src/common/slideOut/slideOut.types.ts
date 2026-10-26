import type { LEVEL } from '@/common/slideOut/slideOut.constants'

export interface Block {
  row: number
  col: number
  length: number
  horizontal: boolean
}

export type Level = (typeof LEVEL)[keyof typeof LEVEL]

export interface Move {
  block: number
  position: number
}

export interface Puzzle {
  blocks: Block[]
  par: number
}

export interface SlideOutGame {
  puzzle: Puzzle
  moves: Move[]
  hint: Move | null
}
