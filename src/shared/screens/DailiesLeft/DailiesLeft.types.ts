import type { GAME_ROUTE } from '@/shared/lib/route.constants'

export interface DailyLeft {
  route: (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
  play: string
  label: string
}

export interface DailySaves {
  twoTone: { puzzleId: string; status: string }[]
  sightlines: { puzzleId: string; status: string }[]
  kakuro: { puzzleId: string; status: string }[]
  slideOut: { puzzleId: string; status: string }[]
  wordWheel: { puzzleId: string; status: string }[]
  sudoku: { puzzleId: string; status: string }[]
  solitaire: { dealId: string; status: string }[]
  fiveLetters: { wordId: string; status: string }[]
}
