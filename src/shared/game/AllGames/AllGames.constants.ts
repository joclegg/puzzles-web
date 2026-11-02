import { GAME_STATUS } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import type { GameStatus } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { GAMES } from '@/games/games.constants'
import type { GameRoute } from '@/shared/lib/route.types'

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
