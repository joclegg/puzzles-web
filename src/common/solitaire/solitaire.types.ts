import type {
  BUILD_ORDER,
  DRAW_MODE,
  PILE_KIND,
  VERDICT,
} from '@/common/solitaire/solitaire.constants'

export interface Board {
  tableau: Column[]
  stock: Card[]
  waste: Card[]
  foundations: Card[][]
}

export type BuildOrder = (typeof BUILD_ORDER)[keyof typeof BUILD_ORDER]

export interface Card {
  rank: number
  suit: number
}

export interface Column {
  cards: Card[]
  faceUpFrom: number
}

export type DrawMode = (typeof DRAW_MODE)[keyof typeof DRAW_MODE]

export interface Move {
  draw: boolean
  from: Pile | null
  count: number
  to: Pile | null
}

export interface Pile {
  kind: PileKind
  index: number
}

export type PileKind = (typeof PILE_KIND)[keyof typeof PILE_KIND]

export interface Selection {
  pile: Pile
  count: number
}

export interface SolitaireGame {
  start: Board
  drawMode: DrawMode
  moves: Move[]
  selection: Selection | null
  oneTapMove: boolean
  order: BuildOrder
}

export interface SolitaireHint {
  selection: Selection | null
  to: Pile | null
}

export type Verdict = (typeof VERDICT)[keyof typeof VERDICT]
