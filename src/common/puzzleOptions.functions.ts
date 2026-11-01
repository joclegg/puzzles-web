import type { PuzzleOptions } from '@/common/game.types'
import { dailyPuzzleId } from '@/common/puzzleSaves.functions'
import { puzzleTitle, sizeLabel } from '@/common/puzzleTitle.functions'

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
