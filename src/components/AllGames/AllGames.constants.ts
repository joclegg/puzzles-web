import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { GameStatus } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAMES } from '@/common/game.constants'
import type { GameRoute } from '@/components/AllGames/AllGames.types'

export const ALL_GOLDS_SHOWN_KEY = 'launcher.allGoldsShown'

export const FIVE_LETTERS_STATUS_LABEL: Record<GameStatus, string> = {
  [GAME_STATUS.IN_PROGRESS]: 'In progress',
  [GAME_STATUS.WON]: 'Won',
  [GAME_STATUS.LOST]: 'Lost',
  [GAME_STATUS.ABANDONED]: 'Abandoned',
}

export const GAME_NAME = Object.fromEntries(
  GAMES.map((game) => [game.id, game.name]),
) as Record<GameRoute, string>
