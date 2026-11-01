import type { MEDAL } from '@/shared/game/dailyMedal.constants'

export interface DailyDay {
  date: string
  medal: Medal
  doneLate: boolean
}

export interface DailyResult {
  date: string
  id: string
  finishedAt: number | null
}

export type Medal = (typeof MEDAL)[keyof typeof MEDAL]
