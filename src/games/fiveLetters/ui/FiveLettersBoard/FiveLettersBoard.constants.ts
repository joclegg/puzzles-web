import { MARK } from '@/games/fiveLetters/engine/fiveLetters.constants'
import type { Mark } from '@/games/fiveLetters/engine/fiveLetters.types'

export const TILE_BASE_CLASS =
  'flex aspect-square items-center justify-center rounded-md text-2xl font-bold uppercase'

export const MARK_TILE_CLASS: Record<Mark, string> = {
  [MARK.CORRECT]: 'bg-fl-correct text-white',
  [MARK.PRESENT]: 'bg-fl-present text-white',
  [MARK.ABSENT]: 'bg-fl-absent text-white',
}

export const EMPTY_TILE_CLASS = 'border-2 border-fl-empty-border'

export const TYPED_TILE_CLASS = 'border-2 border-fl-typed-border'
