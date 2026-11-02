import { TILE } from '@/games/twoTone/engine/twoTone.constants'
import type { Tile } from '@/games/twoTone/engine/twoTone.types'

export const COLOUR_CHOICES: readonly { tile: Tile; label: string }[] = [
  { tile: TILE.RED, label: 'Red' },
  { tile: TILE.BLUE, label: 'Blue' },
]
