import type { GAME_ROUTE } from '@/common/route.constants'
import type { MenuAccent } from '@/components/MenuScreen/MenuScreen.types'

export interface DailyLeft {
  route: (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
  label: string
  accent: MenuAccent
  left: number
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
