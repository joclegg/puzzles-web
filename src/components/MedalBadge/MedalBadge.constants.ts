import { MEDAL } from '@/common/dailyMedal.constants'
import type { Medal } from '@/common/dailyMedal.types'

export const MEDAL_CLASS: Record<Medal, string> = {
  [MEDAL.NONE]: '',
  [MEDAL.BRONZE]: 'bg-sd-bronze',
  [MEDAL.SILVER]: 'bg-sd-silver',
  [MEDAL.GOLD]: 'bg-sd-gold',
}
