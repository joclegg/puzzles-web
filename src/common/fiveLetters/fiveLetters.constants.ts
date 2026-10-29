import type { Mark, Rejection } from '@/common/fiveLetters/fiveLetters.types'

export const WORD_LENGTH = 5

export const MAX_GUESSES = 6

export const FIRST_DAY = '2026-10-25'

export const DAILY_ORDER_SEED = 5

export const SHUFFLED_ANSWER_COUNT = 944

export const MARK = {
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent',
} as const

export const MARK_RANK: Record<Mark, number> = {
  [MARK.CORRECT]: 0,
  [MARK.PRESENT]: 1,
  [MARK.ABSENT]: 2,
}

export const MARK_EMOJI: Record<Mark, string> = {
  [MARK.CORRECT]: '🟩',
  [MARK.PRESENT]: '🟨',
  [MARK.ABSENT]: '⬜',
}

export const REJECTION = {
  TOO_SHORT: 'tooShort',
  NOT_A_WORD: 'notAWord',
  MUST_USE_HINTS: 'mustUseHints',
} as const

export const REJECTION_MESSAGE: Record<Rejection, string> = {
  [REJECTION.TOO_SHORT]: 'Not enough letters',
  [REJECTION.NOT_A_WORD]: 'Not in the word list',
  [REJECTION.MUST_USE_HINTS]: 'Hard mode: use every hint',
}
