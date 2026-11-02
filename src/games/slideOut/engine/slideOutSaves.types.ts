import type { Assists } from '@/shared/game/assists.types'
import type { Level } from '@/games/slideOut/engine/slideOut.types'

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
