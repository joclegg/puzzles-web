import type { GUESS, LEVEL } from '@/common/wordWheel/wordWheel.constants'

export type Guess = (typeof GUESS)[keyof typeof GUESS]

export type Level = (typeof LEVEL)[keyof typeof LEVEL]

export interface Placement {
  word: string
  row: number
  col: number
  across: boolean
}

export interface Puzzle {
  letters: string
  placements: Placement[]
}

export interface WordWheelGame {
  puzzle: Puzzle
  found: string[]
  bonus: string[]
  revealed: string[]
  wheel: string
  last: Guess | null
}
