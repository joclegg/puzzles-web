import { INPUT_MODE } from '@/common/sightlines/sightlinesSettings.constants'
import type { InputMode } from '@/common/sightlines/sightlinesSettings.types'

export const INPUT_MODE_LABEL: Record<InputMode, string> = {
  [INPUT_MODE.TAP_TO_CYCLE]: 'Tap to cycle',
  [INPUT_MODE.PICK_COLOUR]: 'Pick a colour',
}
