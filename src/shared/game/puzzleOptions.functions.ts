import type { PuzzleOptions } from '@/shared/game/game.types'
import { dailyPuzzleId } from '@/shared/game/puzzleSaves.functions'
import { puzzleTitle, sizeLabel } from '@/shared/game/puzzleTitle.functions'

export function sizeOptions(sizes: readonly number[]): PuzzleOptions<number> {
  return {
    filterName: 'Size',
    values: sizes,
    label: sizeLabel,
    filterLabel: String,
    of: (game) => game.size,
    dailyId: ({ date, value }) => dailyPuzzleId({ date, size: value }),
    title: puzzleTitle,
  }
}
