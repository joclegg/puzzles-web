import type { PuzzleOptions } from '@/shared/game/game.types'
import { SIZES } from '@/games/crossword/engine/crossword.constants'
import {
  crosswordSizeLabel,
  crosswordTitle,
} from '@/games/crossword/engine/crosswordSaves.functions'
import { dailyPuzzleId } from '@/shared/game/puzzleSaves.functions'

export const OPTIONS: PuzzleOptions<number> = {
  filterName: 'Size',
  values: SIZES,
  label: crosswordSizeLabel,
  filterLabel: crosswordSizeLabel,
  of: (game) => game.size,
  dailyId: ({ date, value }) => dailyPuzzleId({ date, size: value }),
  title: crosswordTitle,
}
