import type { Guess, Level } from '@/common/wordWheel/wordWheel.types'

export const MIN_WORD = 3

export const FIRST_DAY = '2026-10-25'

export const LEVEL = {
  FIVE: 'five',
  SIX: 'six',
  SEVEN: 'seven',
} as const

export const LEVELS: readonly Level[] = Object.values(LEVEL)

export const LEVEL_LETTERS: Record<Level, number> = {
  [LEVEL.FIVE]: 5,
  [LEVEL.SIX]: 6,
  [LEVEL.SEVEN]: 7,
}

export const GUESS = {
  FOUND: 'found',
  BONUS: 'bonus',
  ALREADY: 'already',
  NOT_A_WORD: 'notAWord',
  TOO_SHORT: 'tooShort',
} as const

export const GUESS_MESSAGE: Record<Guess, string> = {
  [GUESS.FOUND]: 'Nice!',
  [GUESS.BONUS]: 'Bonus word!',
  [GUESS.ALREADY]: 'Already found',
  [GUESS.NOT_A_WORD]: 'Not a word',
  [GUESS.TOO_SHORT]: 'Three letters or more',
}
export const VALID_WORDS_PATH = 'wordwheel/valid.txt'
