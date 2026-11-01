import type { SavedGame } from '@/common/fiveLetters/fiveLettersSaves.types'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import type { GAME_ROUTE } from '@/common/route.constants'
import type { SavedDeal } from '@/common/solitaire/solitaireSaves.types'
import type { SavedSudoku } from '@/common/sudoku/sudokuSaves.types'

export interface AllSaves {
  sudoku: SavedSudoku[]
  solitaire: SavedDeal[]
  twoTone: SavedPuzzle[]
  sightlines: SavedPuzzle[]
  fiveLetters: SavedGame[]
  kakuro: SavedPuzzle[]
  slideOut: SavedPuzzle[]
  wordWheel: SavedPuzzle[]
}

export type GameRoute = (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]

export interface HistoryRow {
  id: string
  route: GameRoute
  game: string
  title: string
  detail: string
  elapsedMs: number | null
  startedAt: number
}
