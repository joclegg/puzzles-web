import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { Medal } from '@/shared/game/dailyMedal.types'

export const MEDAL_ICON_CLASS: Record<Medal, string> = {
  [MEDAL.NONE]: 'text-foreground',
  [MEDAL.BRONZE]: 'text-sd-bronze',
  [MEDAL.SILVER]: 'text-sd-silver',
  [MEDAL.GOLD]: 'text-sd-gold',
}
