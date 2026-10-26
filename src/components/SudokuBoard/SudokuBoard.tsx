import { cn } from '@/common/utils.functions'
import {
  highlightOf,
  isCageWrong,
  isGiven,
  isNumberHighlighted,
  isWrong,
  noteHighlightDigit,
} from '@/common/sudoku/sudoku.functions'
import type { SudokuGame } from '@/common/sudoku/sudoku.types'
import { digitBit } from '@/common/sudoku/sudokuPuzzle.functions'
import {
  CAGE_SIDE_CLASS,
  GRID_COLUMNS_CLASS,
  HIGHLIGHT_CLASS,
  NOTE_COLUMNS_CLASS,
} from '@/components/SudokuBoard/SudokuBoard.constants'
import {
  boxEdges,
  cageSides,
  cageSumCells,
} from '@/components/SudokuBoard/SudokuBoard.functions'

export function SudokuBoard({
  game,
  greyGivenCells,
  boldPlacedDigits,
  onCell,
}: {
  game: SudokuGame
  greyGivenCells: boolean
  boldPlacedDigits: boolean
  onCell: (cell: number) => void
}) {
  const { puzzle } = game
  const grid = puzzle.grid
  const sums = cageSumCells(puzzle)
  const noteDigit = noteHighlightDigit(game)
  const clashes = game.rejected?.clashes ?? new Set<number>()
  const digits = Array.from({ length: grid.size }, (_, i) => i + 1)

  return (
    <div
      role="grid"
      aria-label="Board"
      className={cn(
        '@container grid aspect-square w-full max-w-md border-2 border-sd-thick bg-sd-background',
        GRID_COLUMNS_CLASS[grid.size],
      )}
    >
      {game.values.map((value, cell) => {
        const given = isGiven({ game, cell })
        const wrong = isWrong({ game, cell }) || clashes.has(cell)
        const highlight = highlightOf({ game, cell })
        const edges = boxEdges({ grid, cell })
        const cageIndex = puzzle.cageIndexByCell[cell]
        const sides = cageIndex >= 0 ? cageSides({ puzzle, cell }) : null
        const sumCage = sums.get(cell)
        const label = [
          `Row ${grid.rowOf[cell] + 1} column ${grid.colOf[cell] + 1}`,
          value !== 0 ? String(value) : 'empty',
          given ? 'given' : null,
          wrong ? 'wrong' : null,
          game.marked.has(cell) ? 'marked' : null,
          sumCage !== undefined ? `cage ${puzzle.cages[sumCage].sum}` : null,
        ]
          .filter(Boolean)
          .join(', ')
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={label}
            aria-selected={cell === game.selected}
            onClick={() => onCell(cell)}
            className={cn(
              'relative flex aspect-square items-center justify-center border-sd-thin text-[7cqw] text-sd-digit',
              edges.thickRight
                ? 'border-r-2 border-r-sd-thick'
                : !edges.lastCol && 'border-r',
              edges.thickBottom
                ? 'border-b-2 border-b-sd-thick'
                : !edges.lastRow && 'border-b',
              given && greyGivenCells && 'bg-sd-given',
              HIGHLIGHT_CLASS[highlight],
              wrong && 'text-sd-wrong',
              !given && boldPlacedDigits && 'font-bold',
              isNumberHighlighted({ game, cell }) &&
                !wrong &&
                'text-sd-highlighted-note',
              game.marked.has(cell) && 'ring-2 ring-sd-trial-mark ring-inset',
            )}
          >
            {sides && (
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-[2px] border-dashed border-sd-cage',
                  sides.top && CAGE_SIDE_CLASS.top,
                  sides.right && CAGE_SIDE_CLASS.right,
                  sides.bottom && CAGE_SIDE_CLASS.bottom,
                  sides.left && CAGE_SIDE_CLASS.left,
                )}
              />
            )}
            {sumCage !== undefined && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-[3px] left-[4px] text-[2.4cqw] leading-none font-semibold text-sd-cage-sum',
                  isCageWrong({ game, cage: puzzle.cages[sumCage] }) &&
                    'text-sd-wrong',
                )}
              >
                {puzzle.cages[sumCage].sum}
              </span>
            )}
            {value !== 0 ? (
              value
            ) : game.notes[cell] !== 0 ? (
              <span
                className={cn(
                  'grid size-full p-[8%] text-[2.6cqw] leading-none text-sd-note',
                  NOTE_COLUMNS_CLASS[grid.size],
                )}
              >
                {digits.map((digit) => (
                  <span
                    key={digit}
                    className={cn(
                      'flex items-center justify-center',
                      noteDigit === digit &&
                        'font-bold text-sd-highlighted-note',
                    )}
                  >
                    {(game.notes[cell] & digitBit(digit)) !== 0 ? digit : ''}
                  </span>
                ))}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
