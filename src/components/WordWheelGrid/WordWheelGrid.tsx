import { cn } from '@/common/utils.functions'
import type { Puzzle } from '@/common/wordWheel/wordWheel.types'
import {
  cellKey,
  crosswordSize,
  letterAt,
} from '@/common/wordWheel/wordWheelCrossword.functions'
import { GRID_COLUMNS_CLASS } from '@/components/WordWheelGrid/WordWheelGrid.constants'

export function WordWheelGrid({
  puzzle,
  shown,
  revealed,
}: {
  puzzle: Puzzle
  shown: Set<string>
  revealed: Set<string>
}) {
  const { rows, cols } = crosswordSize(puzzle)
  const letters = letterAt(puzzle)

  return (
    <div
      role="grid"
      aria-label="Crossword"
      className={cn(
        'grid w-full max-w-sm gap-1 lg:max-w-xl',
        GRID_COLUMNS_CLASS[cols],
      )}
    >
      {Array.from({ length: rows * cols }, (_, index) => {
        const key = cellKey({
          row: Math.floor(index / cols),
          col: index % cols,
        })
        const letter = letters.get(key)
        if (letter === undefined) {
          return <span key={key} aria-hidden className="aspect-square" />
        }
        const isShown = shown.has(key)
        return (
          <span
            key={key}
            role="gridcell"
            aria-label={isShown ? letter : 'hidden'}
            className={cn(
              'flex aspect-square items-center justify-center rounded-md text-lg font-bold text-ww-cell-text',
              isShown
                ? revealed.has(key)
                  ? 'bg-ww-cell-hinted'
                  : 'bg-ww-cell-found'
                : 'bg-ww-cell',
            )}
          >
            {isShown ? letter : ''}
          </span>
        )
      })}
    </div>
  )
}
