import { DEFAULT_ASSISTS } from '@/shared/game/assists.constants'
import type { TwoToneSettings } from '@/games/twoTone/engine/twoToneSaves.types'

export const GAMES_KEY = 'twoTone.games'

export const SETTINGS_KEY = 'twoTone.settings'

export const INPUT_MODE = {
  TAP_TO_CYCLE: 'tapToCycle',
  PICK_COLOUR: 'pickColour',
} as const

export const DEFAULT_SETTINGS: TwoToneSettings = {
  ...DEFAULT_ASSISTS,
  inputMode: INPUT_MODE.TAP_TO_CYCLE,
  markBrokenRules: false,
  showTimer: true,
  showProgress: false,
}

export const TITLE = 'Two Tone'
