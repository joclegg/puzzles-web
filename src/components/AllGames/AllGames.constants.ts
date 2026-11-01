import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { GameStatus } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAME_ROUTE } from '@/common/route.constants'
import type { GameRoute } from '@/components/AllGames/AllGames.types'

export const ALL_GOLDS_SHOWN_KEY = 'launcher.allGoldsShown'

export const FIVE_LETTERS_STATUS_LABEL: Record<GameStatus, string> = {
  [GAME_STATUS.IN_PROGRESS]: 'In progress',
  [GAME_STATUS.WON]: 'Won',
  [GAME_STATUS.LOST]: 'Lost',
  [GAME_STATUS.ABANDONED]: 'Abandoned',
}

export const GAME_NAME: Record<GameRoute, string> = {
  [GAME_ROUTE.SUDOKU]: 'Sudoku',
  [GAME_ROUTE.SOLITAIRE]: 'Solitaire',
  [GAME_ROUTE.TWO_TONE]: 'Two Tone',
  [GAME_ROUTE.SIGHTLINES]: 'Sightlines',
  [GAME_ROUTE.FIVE_LETTERS]: 'Five Letters',
  [GAME_ROUTE.KAKURO]: 'Kakuro',
  [GAME_ROUTE.SLIDE_OUT]: 'Slide Out',
  [GAME_ROUTE.WORD_WHEEL]: 'Word Wheel',
}
