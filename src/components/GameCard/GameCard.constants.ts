import { MEDAL } from '@/common/dailyMedal.constants'
import type { Medal } from '@/common/dailyMedal.types'

export const MEDAL_LABEL: Record<Medal, string> = {
  [MEDAL.NONE]: 'No',
  [MEDAL.BRONZE]: 'Bronze',
  [MEDAL.SILVER]: 'Silver',
  [MEDAL.GOLD]: 'Gold',
}
