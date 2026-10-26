import { HINT_STYLE } from '@/common/assists.constants'
import type { HintStyle } from '@/common/assists.types'

export const HINT_STYLE_LABEL: Record<HintStyle, string> = {
  [HINT_STYLE.POINT]: 'Point it out',
  [HINT_STYLE.FILL]: 'Fill it in',
}
