import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { GameStatus } from '@/common/fiveLetters/fiveLettersSaves.types'

export const DAILY_RESULT_LABEL: Record<GameStatus, string | null> = {
  [GAME_STATUS.WON]: 'Solved',
  [GAME_STATUS.LOST]: 'Missed today',
  [GAME_STATUS.IN_PROGRESS]: 'In progress',
  [GAME_STATUS.ABANDONED]: null,
}
