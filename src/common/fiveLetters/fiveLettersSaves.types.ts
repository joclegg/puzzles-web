import type { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'

export interface FiveLettersSettings {
  hardMode: boolean
  highContrast: boolean
}

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export interface SavedGame {
  id: number
  wordId: string
  answer: string
  guesses: string[]
  hardMode: boolean
  status: GameStatus
  startedAt: number
  finishedAt: number | null
}

export interface WordRef {
  id: string
  answer: string
}

export interface WordStats {
  played: number
  won: number
  currentStreak: number
  maxStreak: number
  guessCounts: number[]
}
