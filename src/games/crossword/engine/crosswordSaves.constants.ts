import { DEFAULT_ASSISTS } from '@/shared/game/assists.constants'
import type { CrosswordSettings } from '@/games/crossword/engine/crosswordSaves.types'

export const GAMES_KEY = 'crossword.games'

export const SETTINGS_KEY = 'crossword.settings'

export const DEFAULT_SETTINGS: CrosswordSettings = {
  showTimer: true,
  showMistakes: false,
  allowReveal: false,
  skipFilledCells: true,
  showHints: DEFAULT_ASSISTS.showHints,
  hintStyle: DEFAULT_ASSISTS.hintStyle,
}

export const TITLE = 'Crossword'
