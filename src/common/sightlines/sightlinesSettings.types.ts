import type { INPUT_MODE } from '@/common/sightlines/sightlinesSettings.constants'

export type InputMode = (typeof INPUT_MODE)[keyof typeof INPUT_MODE]

export interface SightlinesSettings {
  inputMode: InputMode
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
  showSeen: boolean
}
