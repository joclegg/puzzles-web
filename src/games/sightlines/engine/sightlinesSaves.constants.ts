import { DEFAULT_ASSISTS } from '@/shared/game/assists.constants'
import type { SightlinesSettings } from '@/games/sightlines/engine/sightlinesSaves.types'

export const GAMES_KEY = 'sightlines.games'

export const SETTINGS_KEY = 'sightlines.settings'

export const INPUT_MODE = {
  TAP_TO_CYCLE: 'tapToCycle',
  PICK_COLOUR: 'pickColour',
} as const

export const DEFAULT_SETTINGS: SightlinesSettings = {
  ...DEFAULT_ASSISTS,
  inputMode: INPUT_MODE.TAP_TO_CYCLE,
  markBrokenRules: false,
  showTimer: true,
  showProgress: false,
  showSeen: false,
}

export const TITLE = 'Sightlines'
