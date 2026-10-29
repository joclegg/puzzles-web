import type { Assists } from '@/common/assists.types'
import type {
  BuildOrder,
  DrawMode,
  Verdict,
} from '@/common/solitaire/solitaire.types'
import type { DEAL_STATUS } from '@/common/solitaire/solitaireSaves.constants'

export type DealStatus = (typeof DEAL_STATUS)[keyof typeof DEAL_STATUS]

export interface DrawStats {
  drawMode: DrawMode
  played: number
  won: number
  bestMs: number | null
  averageMs: number | null
  fewestMoves: number | null
}

export interface SavedDeal {
  id: string
  dealId: string
  drawMode: DrawMode
  order: BuildOrder
  board: string
  moves: string
  moveCount: number
  elapsedMs: number
  status: DealStatus
  startedAt: number
  finishedAt: number | null
}

export interface SolitaireSettings extends Assists {
  drawMode: DrawMode
  reverse: boolean
  oneTapMove: boolean
  winnableOnly: boolean
  warnUnwinnable: boolean
  showTimer: boolean
  showMoveCount: boolean
}

export interface SolverReply {
  id: number
  board: string
  verdict: Verdict | null
}

export interface SolverRequest {
  id: number
  board: string
  drawMode: DrawMode
  order: BuildOrder
}
