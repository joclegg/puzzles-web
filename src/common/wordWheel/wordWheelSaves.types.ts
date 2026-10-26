import type { Level } from '@/common/wordWheel/wordWheel.types'

export interface LevelStats {
  level: Level
  played: number
  solved: number
  bonusWords: number
  bestMs: number | null
}

export interface Progress {
  found: string[]
  bonus: string[]
  revealed: string[]
}

export interface WordWheelSettings {
  showTimer: boolean
  showBonusCount: boolean
}
