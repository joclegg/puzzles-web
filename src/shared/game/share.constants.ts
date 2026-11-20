import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { Medal } from '@/shared/game/dailyMedal.types'

export const SHARE_LINK = 'joclegg.github.io/puzzles-web'

export const CHART_WIDTH = 8

export const MEDAL_EMOJI: Record<Medal, string> = {
  [MEDAL.NONE]: '',
  [MEDAL.BRONZE]: '🥉',
  [MEDAL.SILVER]: '🥈',
  [MEDAL.GOLD]: '🥇',
}

export const MEDAL_SQUARE: Record<Medal, string> = {
  [MEDAL.NONE]: '⬛',
  [MEDAL.BRONZE]: '🟧',
  [MEDAL.SILVER]: '⬜',
  [MEDAL.GOLD]: '🟨',
}
