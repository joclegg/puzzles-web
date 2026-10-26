import { DOT } from '@/common/sightlines/sightlines.constants'
import type { Dot } from '@/common/sightlines/sightlines.types'

export const COLOUR_CHOICES: readonly { dot: Dot; label: string }[] = [
  { dot: DOT.BLUE, label: 'Blue' },
  { dot: DOT.RED, label: 'Red' },
]
