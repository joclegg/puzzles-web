import { DEFAULT_ASSISTS } from '@/shared/game/assists.constants'
import type { SlideOutSettings } from '@/games/slideOut/engine/slideOutSaves.types'

export const GAMES_KEY = 'slideOut.games'

export const SETTINGS_KEY = 'slideOut.settings'

export const DEFAULT_SETTINGS: SlideOutSettings = {
  ...DEFAULT_ASSISTS,
  showTimer: true,
  showPar: true,
}

export const TITLE = 'Slide Out'
