import type {
  Direction,
  Dot,
  Reason,
} from '@/games/sightlines/engine/sightlines.types'

export const DOT = {
  EMPTY: '.',
  BLUE: 'B',
  RED: 'R',
} as const

export const NEXT_DOT: Record<Dot, Dot> = {
  [DOT.EMPTY]: DOT.BLUE,
  [DOT.BLUE]: DOT.RED,
  [DOT.RED]: DOT.EMPTY,
}

export const SIZES = [4, 5, 6, 7, 8, 9]

export const DIRECTIONS: readonly Direction[] = [
  { rowStep: -1, colStep: 0 },
  { rowStep: 1, colStep: 0 },
  { rowStep: 0, colStep: -1 },
  { rowStep: 0, colStep: 1 },
]

export const RED_CHANCE = 0.3

export const RADIX = 36

export const WALL = 'X'

export const REASON = {
  SATISFIED: 'satisfied',
  TOO_MANY: 'tooMany',
  NEEDS: 'needs',
  ALONE: 'alone',
} as const

export const REASON_MESSAGE: Record<Reason, string> = {
  [REASON.SATISFIED]:
    'This number already sees enough blue dots, so the dots that close off its view are red.',
  [REASON.TOO_MANY]:
    'A blue dot here would let this number see too many, so it is red.',
  [REASON.NEEDS]:
    "This dot can't see enough the other ways, so this way carries on blue.",
  [REASON.ALONE]:
    'A blue dot here would be boxed in and see nothing, so it is red.',
}

export const HINT_KIND = {
  MISTAKE: 'mistake',
  NEXT: 'next',
} as const

export const DAILY_SEED_SPREAD = 7919n
