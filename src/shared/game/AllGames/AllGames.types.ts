import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import type { GameRoute } from '@/shared/lib/route.types'
import type { SavedDeal } from '@/games/solitaire/engine/solitaireSaves.types'
import type { SavedSudoku } from '@/games/sudoku/engine/sudokuSaves.types'

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

export interface HistoryRow {
  id: string
  route: GameRoute
  game: string
  title: string
  detail: string
  elapsedMs: number | null
  startedAt: number
}
