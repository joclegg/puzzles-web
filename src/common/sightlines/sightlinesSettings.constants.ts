import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import type { SightlinesSettings } from '@/common/sightlines/sightlinesSettings.types'

export const GAMES_KEY = 'sightlines.games'

export const SETTINGS_KEY = 'sightlines.settings'

export const DEFAULT_SETTINGS: SightlinesSettings = {
  ...DEFAULT_ASSISTS,
  markBrokenRules: false,
  showTimer: true,
  showProgress: false,
  showSeen: false,
}

export const TITLE = 'Sightlines'
