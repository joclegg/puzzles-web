import beginner from '@data/slideout/beginner.txt?raw'
import easy from '@data/slideout/easy.txt?raw'
import evil from '@data/slideout/evil.txt?raw'
import expert from '@data/slideout/expert.txt?raw'
import hard from '@data/slideout/hard.txt?raw'
import medium from '@data/slideout/medium.txt?raw'
import { LEVEL } from '@/common/slideOut/slideOut.constants'
import type { Level } from '@/common/slideOut/slideOut.types'

export const BANK_TEXT: Record<Level, string> = {
  [LEVEL.BEGINNER]: beginner,
  [LEVEL.EASY]: easy,
  [LEVEL.MEDIUM]: medium,
  [LEVEL.HARD]: hard,
  [LEVEL.EXPERT]: expert,
  [LEVEL.EVIL]: evil,
}
