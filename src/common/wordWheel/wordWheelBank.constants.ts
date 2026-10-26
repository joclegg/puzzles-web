import five from '@data/wordwheel/five.txt?raw'
import seven from '@data/wordwheel/seven.txt?raw'
import six from '@data/wordwheel/six.txt?raw'
import validText from '@data/wordwheel/valid.txt?raw'
import { LEVEL } from '@/common/wordWheel/wordWheel.constants'
import { validWords } from '@/common/wordWheel/wordWheel.functions'
import type { Level } from '@/common/wordWheel/wordWheel.types'

export const BANK_TEXT: Record<Level, string> = {
  [LEVEL.FIVE]: five,
  [LEVEL.SIX]: six,
  [LEVEL.SEVEN]: seven,
}

export const VALID_WORDS = validWords(validText)
