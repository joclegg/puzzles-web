import type { Assists } from '@/shared/game/assists.types'
import type { INPUT_MODE } from '@/games/sightlines/engine/sightlinesSettings.constants'

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface SightlinesSettings extends Assists {
  inputMode: InputMode
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
  showSeen: boolean
}
