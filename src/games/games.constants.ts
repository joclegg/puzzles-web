import { DEFINITION as SUDOKU } from '@/games/sudoku/definition'
import { DEFINITION as SOLITAIRE } from '@/games/solitaire/definition'
import { DEFINITION as TWO_TONE } from '@/games/twoTone/definition'
import { DEFINITION as SIGHTLINES } from '@/games/sightlines/definition'
import { DEFINITION as FIVE_LETTERS } from '@/games/fiveLetters/definition'
import { DEFINITION as KAKURO } from '@/games/kakuro/definition'
import { DEFINITION as SLIDE_OUT } from '@/games/slideOut/definition'
import { DEFINITION as WORD_WHEEL } from '@/games/wordWheel/definition'
import type { GameDefinition } from '@/shared/game/game.types'

export const GAMES: readonly GameDefinition[] = [
  SUDOKU,
  SOLITAIRE,
  TWO_TONE,
  SIGHTLINES,
  FIVE_LETTERS,
  KAKURO,
  SLIDE_OUT,
  WORD_WHEEL,
]
