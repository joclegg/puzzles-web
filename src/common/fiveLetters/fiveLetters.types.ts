import type {
  MARK,
  REJECTION,
} from '@/common/fiveLetters/fiveLetters.constants'

export interface FiveLettersGame {
  answer: string
  guesses: string[]
  typing: string
  hardMode: boolean
  rejection: Rejection | null
  revealed: boolean
}

export type Mark = (typeof MARK)[keyof typeof MARK]

export type Rejection = (typeof REJECTION)[keyof typeof REJECTION]

export interface Words {
  answers: string[]
  allowed: Set<string>
  dailyOrder: string[]
}
