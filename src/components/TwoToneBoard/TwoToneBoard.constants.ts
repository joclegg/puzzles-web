import { TILE } from '@/common/twoTone/twoTone.constants'
import type { Tile } from '@/common/twoTone/twoTone.types'

export const GRID_COLUMNS_CLASS: Record<number, string> = {
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  8: 'grid-cols-8',
  10: 'grid-cols-10',
  12: 'grid-cols-12',
}

export const TILE_CLASS: Record<Tile, string> = {
  [TILE.RED]: 'bg-tt-red border-b-tt-red-edge',
  [TILE.BLUE]: 'bg-tt-blue border-b-tt-blue-edge',
  [TILE.EMPTY]: 'bg-tt-empty border-b-tt-empty',
}

export const TILE_NAME: Record<Tile, string> = {
  [TILE.RED]: 'red',
  [TILE.BLUE]: 'blue',
  [TILE.EMPTY]: 'empty',
}
