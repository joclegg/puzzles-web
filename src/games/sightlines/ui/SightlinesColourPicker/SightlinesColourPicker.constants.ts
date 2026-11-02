import { DOT } from '@/games/sightlines/engine/sightlines.constants'
import type { Dot } from '@/games/sightlines/engine/sightlines.types'

export const COLOUR_CHOICES: readonly { dot: Dot; label: string }[] = [
  { dot: DOT.BLUE, label: 'Blue' },
  { dot: DOT.RED, label: 'Red' },
]
