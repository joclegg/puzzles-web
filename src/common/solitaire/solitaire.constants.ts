import type {
  BuildOrder,
  Card,
  DrawMode,
  PileKind,
  Verdict,
} from '@/common/solitaire/solitaire.types'

export const ACE = 1

export const JACK = 11

export const QUEEN = 12

export const KING = 13

export const COLUMNS = 7

export const FOUNDATIONS = 4

export const RANK_CODES = 'A23456789TJQK'

export const SUITS = [
  { symbol: '♣', code: 'C', isRed: false, name: 'clubs' },
  { symbol: '♦', code: 'D', isRed: true, name: 'diamonds' },
  { symbol: '♥', code: 'H', isRed: true, name: 'hearts' },
  { symbol: '♠', code: 'S', isRed: false, name: 'spades' },
]

export const DRAW_MODE = {
  DRAW_ONE: 'drawOne',
  DRAW_THREE: 'drawThree',
} as const

export const DRAW_CARDS: Record<DrawMode, number> = {
  [DRAW_MODE.DRAW_ONE]: 1,
  [DRAW_MODE.DRAW_THREE]: 3,
}

export const DRAW_MODE_LABEL: Record<DrawMode, string> = {
  [DRAW_MODE.DRAW_ONE]: 'Draw 1',
  [DRAW_MODE.DRAW_THREE]: 'Draw 3',
}

export const BUILD_ORDER = {
  DOWN: 'down',
  UP: 'up',
} as const

export const ORDER_RULES: Record<
  BuildOrder,
  { step: number; columnStarter: number; foundationStarter: number }
> = {
  [BUILD_ORDER.DOWN]: { step: 1, columnStarter: KING, foundationStarter: ACE },
  [BUILD_ORDER.UP]: { step: -1, columnStarter: ACE, foundationStarter: KING },
}

export const PILE_KIND = {
  WASTE: 'waste',
  FOUNDATION: 'foundation',
  TABLEAU: 'tableau',
} as const

export const PILE_CODE: Record<PileKind, string> = {
  [PILE_KIND.WASTE]: 'W',
  [PILE_KIND.FOUNDATION]: 'F',
  [PILE_KIND.TABLEAU]: 'T',
}

export const VERDICT = {
  WINNABLE: 'winnable',
  UNWINNABLE: 'unwinnable',
  UNKNOWN: 'unknown',
} as const

export const VERDICT_NAMES: readonly Verdict[] = Object.values(VERDICT)

export const DEFAULT_BUDGET = 200_000

export const DEAL_BUDGET = 20_000

export const DAILY_SEED_SPREAD = 7919n

export const DECK: readonly Card[] = SUITS.flatMap((_, suit) =>
  Array.from({ length: KING }, (_, i) => ({ rank: ACE + i, suit })),
)
export const DAILY_SEED_LINES = 1000
