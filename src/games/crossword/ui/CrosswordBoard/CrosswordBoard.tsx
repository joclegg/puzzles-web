import { EMPTY } from '@/games/crossword/engine/crossword.constants'
import type { Puzzle } from '@/games/crossword/engine/crossword.types'
import { GRID_COLUMNS_CLASS } from '@/games/crossword/ui/CrosswordBoard/CrosswordBoard.constants'
import { cn } from '@/shared/lib/utils.functions'

export function CrosswordBoard({
  puzzle,
  entries,
  selected,
  wordCells,
  wrong,
  onCell,
}: {
  puzzle: Puzzle
  entries: string[]
  selected: number
  wordCells: Set<number>
  wrong: Set<number>
  onCell: (cell: number) => void
}) {
  return (
    <div
      role="grid"
      aria-label="Board"
      className={cn(
        '@container grid w-full gap-px border border-cw-line bg-cw-line select-none',
        GRID_COLUMNS_CLASS[puzzle.size],
      )}
    >
      {puzzle.solution.map((_, cell) => {
        if (!puzzle.isWhite[cell]) {
          return (
            <div
              key={cell}
              role="gridcell"
              aria-label="block"
              className="aspect-square bg-cw-block"
            />
          )
        }
        const row = Math.floor(cell / puzzle.size) + 1
        const column = (cell % puzzle.size) + 1
        const entry = entries[cell]
        const number = puzzle.numbers.get(cell)
        const isWrong = wrong.has(cell)
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            tabIndex={-1}
            data-testid={`cell_r${row}c${column}`}
            aria-label={[
              `Row ${row} column ${column}`,
              entry === EMPTY ? 'empty' : entry,
              isWrong ? 'wrong' : null,
              cell === selected ? 'selected' : null,
            ]
              .filter(Boolean)
              .join(', ')}
            aria-selected={cell === selected}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onCell(cell)}
            className={cn(
              'relative flex aspect-square items-center justify-center bg-cw-background text-[4.5cqw] leading-none font-semibold text-cw-letter uppercase',
              cell === selected
                ? 'bg-cw-selected'
                : wordCells.has(cell) && 'bg-cw-word',
              isWrong && 'text-cw-wrong',
            )}
          >
            {number !== undefined && (
              <span className="absolute top-px left-0.5 text-[1.9cqw] font-normal text-cw-number">
                {number}
              </span>
            )}
            {entry === EMPTY ? '' : entry}
          </button>
        )
      })}
    </div>
  )
}
