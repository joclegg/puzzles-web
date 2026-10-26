import beginner from '@/assets/slideout/beginner.txt?raw'
import easy from '@/assets/slideout/easy.txt?raw'
import expert from '@/assets/slideout/expert.txt?raw'
import hard from '@/assets/slideout/hard.txt?raw'
import medium from '@/assets/slideout/medium.txt?raw'
import { LEVEL } from '@/common/slideOut/slideOut.constants'
import type { Level } from '@/common/slideOut/slideOut.types'

export const BANK_TEXT: Record<Level, string> = {
  [LEVEL.BEGINNER]: beginner,
  [LEVEL.EASY]: easy,
  [LEVEL.MEDIUM]: medium,
  [LEVEL.HARD]: hard,
  [LEVEL.EXPERT]: expert,
}
