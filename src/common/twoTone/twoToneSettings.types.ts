import type { Assists } from '@/common/assists.types'
import type { INPUT_MODE } from '@/common/twoTone/twoToneSettings.constants'

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface TwoToneSettings extends Assists {
  inputMode: InputMode
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
}
