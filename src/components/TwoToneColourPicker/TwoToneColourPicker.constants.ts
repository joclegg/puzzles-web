import { TILE } from '@/common/twoTone/twoTone.constants'
import type { Tile } from '@/common/twoTone/twoTone.types'

export const COLOUR_CHOICES: readonly { tile: Tile; label: string }[] = [
  { tile: TILE.RED, label: 'Red' },
  { tile: TILE.BLUE, label: 'Blue' },
]
