import type { Assists } from '@/common/assists.types'
import type { Level } from '@/common/slideOut/slideOut.types'

export interface LevelStats {
  level: Level
  played: number
  solved: number
  atPar: number
  bestMs: number | null
}

export interface SlideOutSettings extends Assists {
  showTimer: boolean
  showPar: boolean
}
