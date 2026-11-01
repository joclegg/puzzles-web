import type { Assists } from '@/common/assists.types'
export interface SightlinesSettings extends Assists {
  markBrokenRules: boolean
  showTimer: boolean
  showProgress: boolean
  showSeen: boolean
}
