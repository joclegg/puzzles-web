import type { INPUT_MODE } from '@/common/twoTone/twoToneSettings.constants'

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface TwoToneSettings {
  inputMode: InputMode
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
}
