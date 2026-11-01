import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import type { TwoToneSettings } from '@/common/twoTone/twoToneSettings.types'

export const GAMES_KEY = 'twoTone.games'

export const SETTINGS_KEY = 'twoTone.settings'

export const DEFAULT_SETTINGS: TwoToneSettings = {
  ...DEFAULT_ASSISTS,
  markBrokenRules: false,
  showTimer: true,
  showProgress: false,
}

export const TITLE = 'Two Tone'
