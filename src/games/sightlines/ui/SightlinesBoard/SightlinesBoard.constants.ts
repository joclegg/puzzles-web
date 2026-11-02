import { DOT } from '@/games/sightlines/engine/sightlines.constants'
import type { Dot } from '@/games/sightlines/engine/sightlines.types'

export const GRID_COLUMNS_CLASS: Record<number, string> = {
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
}

export const DOT_CLASS: Record<Dot, string> = {
  [DOT.BLUE]: 'bg-sl-blue border-b-sl-blue-edge',
  [DOT.RED]: 'bg-sl-red border-b-sl-red-edge',
  [DOT.EMPTY]: 'bg-sl-empty border-b-sl-empty',
}

export const DOT_NAME: Record<Dot, string> = {
  [DOT.BLUE]: 'blue',
  [DOT.RED]: 'red',
  [DOT.EMPTY]: 'empty',
}
