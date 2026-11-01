import { INPUT_MODE } from '@/common/twoTone/twoToneSettings.constants'
import type { InputMode } from '@/common/twoTone/twoToneSettings.types'

export const INPUT_MODE_LABEL: Record<InputMode, string> = {
  [INPUT_MODE.TAP_TO_CYCLE]: 'Tap to cycle',
  [INPUT_MODE.PICK_COLOUR]: 'Pick a colour',
}
