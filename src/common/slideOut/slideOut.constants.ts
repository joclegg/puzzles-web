import type { Level } from '@/common/slideOut/slideOut.types'

export const SIZE = 6

export const EXIT_ROW = 2

export const FIRST_DAY = '2026-10-25'

export const LEVEL = {
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
} as const

export const LEVELS: readonly Level[] = Object.values(LEVEL)

export const LEVEL_LABEL: Record<Level, string> = {
  [LEVEL.BEGINNER]: 'Beginner',
  [LEVEL.EASY]: 'Easy',
  [LEVEL.MEDIUM]: 'Medium',
  [LEVEL.HARD]: 'Hard',
  [LEVEL.EXPERT]: 'Expert',
}
