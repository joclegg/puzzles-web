import type { TwoToneSettings } from '@/common/twoTone/twoToneSettings.types'

export const GAMES_KEY = 'twoTone.games'

export const SETTINGS_KEY = 'twoTone.settings'

export const INPUT_MODE = {
  TAP_TO_CYCLE: 'tapToCycle',
  PICK_COLOUR: 'pickColour',
} as const

export const DEFAULT_SETTINGS: TwoToneSettings = {
  inputMode: INPUT_MODE.TAP_TO_CYCLE,
  markBrokenRules: true,
  showTimer: true,
  showProgress: true,
}

export const TITLE = 'Two Tone'
