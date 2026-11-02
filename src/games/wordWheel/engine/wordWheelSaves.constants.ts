import { DEFAULT_ASSISTS } from '@/shared/game/assists.constants'
import type { WordWheelSettings } from '@/games/wordWheel/engine/wordWheelSaves.types'

export const GAMES_KEY = 'wordWheel.games'

export const SETTINGS_KEY = 'wordWheel.settings'

export const DEFAULT_SETTINGS: WordWheelSettings = {
  ...DEFAULT_ASSISTS,
  showTimer: true,
  showBonusCount: true,
}

export const TITLE = 'Word Wheel'
