import { MEDAL } from '@/common/dailyMedal.constants'
import type { Medal } from '@/common/dailyMedal.types'

export const MEDAL_ICON_CLASS: Record<Medal, string> = {
  [MEDAL.NONE]: 'text-foreground',
  [MEDAL.BRONZE]: 'text-sd-bronze',
  [MEDAL.SILVER]: 'text-sd-silver',
  [MEDAL.GOLD]: 'text-sd-gold',
}
