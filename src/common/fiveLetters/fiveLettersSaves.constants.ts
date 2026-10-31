import { DEFAULT_ASSISTS } from '@/common/assists.constants'
export const GAMES_KEY = 'fiveLetters.games'

export const SETTINGS_KEY = 'fiveLetters.settings'

export const DAILY_PREFIX = 'daily_'

export const DAILY2_PREFIX = 'daily2_'

export const LEGACY_DAILY2_PREFIX = 'nyt_'

export const PRACTICE_SLOT = 'practice'

export const GAME_STATUS = {
  IN_PROGRESS: 'inProgress',
  WON: 'won',
  LOST: 'lost',
  ABANDONED: 'abandoned',
} as const

export const DEFAULT_SETTINGS = {
  ...DEFAULT_ASSISTS,
  hardMode: false,
  highContrast: false,
}

export const DAILY2_URL = 'https://puzzles-daily.joclegg.dev/word/'
