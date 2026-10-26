export const GAMES_KEY = 'fiveLetters.games'

export const SETTINGS_KEY = 'fiveLetters.settings'

export const DAILY_PREFIX = 'daily_'

export const PRACTICE_SLOT = 'practice'

export const GAME_STATUS = {
  IN_PROGRESS: 'inProgress',
  WON: 'won',
  LOST: 'lost',
  ABANDONED: 'abandoned',
} as const

export const DEFAULT_SETTINGS = {
  hardMode: false,
  highContrast: false,
  nytWord: false,
}

export const NYT_PROXY_URL =
  'https://r.jina.ai/https://www.nytimes.com/svc/wordle/v2/'
