import type { Level } from '@/common/slideOut/slideOut.types'

export interface LevelStats {
  level: Level
  played: number
  solved: number
  atPar: number
  bestMs: number | null
}

export interface SlideOutSettings {
  showTimer: boolean
  showPar: boolean
}
