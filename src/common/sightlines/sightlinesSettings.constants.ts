import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import type { SightlinesSettings } from '@/common/sightlines/sightlinesSettings.types'

export const GAMES_KEY = 'sightlines.games'

export const SETTINGS_KEY = 'sightlines.settings'

export const INPUT_MODE = {
  TAP_TO_CYCLE: 'tapToCycle',
  PICK_COLOUR: 'pickColour',
} as const

export const DEFAULT_SETTINGS: SightlinesSettings = {
  ...DEFAULT_ASSISTS,
  inputMode: INPUT_MODE.TAP_TO_CYCLE,
  markBrokenRules: true,
  showTimer: true,
  showProgress: true,
  showSeen: false,
}

export const TITLE = 'Sightlines'
