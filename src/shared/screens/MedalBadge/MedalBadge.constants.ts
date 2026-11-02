import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { Medal } from '@/shared/game/dailyMedal.types'

export const MEDAL_CLASS: Record<Medal, string> = {
  [MEDAL.NONE]: '',
  [MEDAL.BRONZE]: 'bg-sd-bronze',
  [MEDAL.SILVER]: 'bg-sd-silver',
  [MEDAL.GOLD]: 'bg-sd-gold',
}
