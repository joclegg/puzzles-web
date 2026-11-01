import { GAME_STATUS } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import type { GameStatus } from '@/games/fiveLetters/engine/fiveLettersSaves.types'

export const DAILY_RESULT_LABEL: Record<GameStatus, string | null> = {
  [GAME_STATUS.WON]: 'Solved',
  [GAME_STATUS.LOST]: 'Missed today',
  [GAME_STATUS.IN_PROGRESS]: 'In progress',
  [GAME_STATUS.ABANDONED]: null,
}
