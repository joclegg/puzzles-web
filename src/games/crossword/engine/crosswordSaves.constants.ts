import type { CrosswordSettings } from '@/games/crossword/engine/crosswordSaves.types'

export const GAMES_KEY = 'crossword.games'

export const SETTINGS_KEY = 'crossword.settings'

export const DEFAULT_SETTINGS: CrosswordSettings = {
  showTimer: true,
  showMistakes: false,
  allowReveal: false,
  skipFilledCells: true,
}

export const TITLE = 'Crossword'
