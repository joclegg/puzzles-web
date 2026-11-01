import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { Medal } from '@/shared/game/dailyMedal.types'

export const MEDAL_LABEL: Record<Medal, string> = {
  [MEDAL.NONE]: 'No',
  [MEDAL.BRONZE]: 'Bronze',
  [MEDAL.SILVER]: 'Silver',
  [MEDAL.GOLD]: 'Gold',
}
