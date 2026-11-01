import { cn } from '@/shared/lib/utils.functions'
import type { Puzzle } from '@/games/wordWheel/engine/wordWheel.types'
import {
  cellKey,
  crosswordSize,
  letterAt,
} from '@/games/wordWheel/engine/wordWheelCrossword.functions'
import {
  CELL_GAP,
  CELL_SIZE,
} from '@/games/wordWheel/ui/WordWheelGrid/WordWheelGrid.constants'

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
  const step = CELL_SIZE + CELL_GAP

  return (
    <svg
      role="grid"
      aria-label="Crossword"
      viewBox={`0 0 ${cols * step - CELL_GAP} ${rows * step - CELL_GAP}`}
      className="size-full max-w-xl"
    >
      {[...letters.entries()].map(([key, letter]) => {
        const [row, col] = key.split(',').map(Number)
        const isShown = shown.has(key)
        return (
          <g
            key={cellKey({ row, col })}
            role="gridcell"
            aria-label={isShown ? letter : 'hidden'}
          >
            <rect
              x={col * step}
              y={row * step}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={6}
              className={cn(
                isShown
                  ? revealed.has(key)
                    ? 'fill-ww-cell-hinted'
                    : 'fill-ww-cell-found'
                  : 'fill-ww-cell',
              )}
            />
            {isShown && (
              <text
                x={col * step + CELL_SIZE / 2}
                y={row * step + CELL_SIZE / 2}
                dominantBaseline="central"
                textAnchor="middle"
                className="fill-ww-cell-text text-[22px] font-bold"
              >
                {letter}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
