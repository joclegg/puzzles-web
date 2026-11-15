import type { Assists } from '@/shared/game/assists.types'

export interface CrosswordSettings extends Pick<
  Assists,
  'showHints' | 'hintStyle'
> {
  showTimer: boolean
  showMistakes: boolean
  allowReveal: boolean
  skipFilledCells: boolean
}
