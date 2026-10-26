import type { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'

export interface PuzzleRef {
  id: string
  size: number
  puzzle: string
}

export type PuzzleStatus = (typeof PUZZLE_STATUS)[keyof typeof PUZZLE_STATUS]

export interface SavedPuzzle {
  id: number
  puzzleId: string
  size: number
  puzzle: string
  changes: string
  elapsedMs: number
  hints: number
  mistakes: number
  status: PuzzleStatus
  startedAt: number
  finishedAt: number | null
}

export interface SizeStats {
  size: number
  played: number
  solved: number
  bestMs: number | null
  averageMs: number | null
}
