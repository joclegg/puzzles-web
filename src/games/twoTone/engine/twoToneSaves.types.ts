import type { Assists } from '@/shared/game/assists.types'
import type { INPUT_MODE } from '@/games/twoTone/engine/twoToneSaves.constants'

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface TwoToneSettings extends Assists {
  inputMode: InputMode
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
}
