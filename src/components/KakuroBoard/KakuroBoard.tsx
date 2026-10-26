import { cn } from '@/common/utils.functions'
import type { Puzzle } from '@/common/kakuro/kakuro.types'
import { bit } from '@/common/kakuro/kakuroPuzzle.functions'
import {
  GRID_COLUMNS_CLASS,
  NOTE_POSITIONS,
} from '@/components/KakuroBoard/KakuroBoard.constants'

export function KakuroBoard({
  puzzle,
  values,
  notes,
  selected,
  runCells,
  wrong,
  sameDigit,
  marked,
  onCell,
}: {
  puzzle: Puzzle
  values: number[]
  notes: number[]
  selected: number | null
  runCells: Set<number>
  wrong: Set<number>
  sameDigit: Set<number>
  marked: Set<number>
  onCell: (cell: number) => void
}) {
  return (
    <div
      role="grid"
      aria-label="Board"
      className={cn(
        '@container grid w-full max-w-md gap-px border border-kk-line bg-kk-line',
        GRID_COLUMNS_CLASS[puzzle.size],
      )}
    >
      {puzzle.solution.map((_, cell) => {
        const row = Math.floor(cell / puzzle.size) + 1
        const column = (cell % puzzle.size) + 1
        if (!puzzle.isWhite[cell]) {
          const across = puzzle.acrossClues.get(cell)
          const down = puzzle.downClues.get(cell)
          const hasClue = across !== undefined || down !== undefined
          return (
            <div
              key={cell}
              role="gridcell"
              aria-label={
                hasClue
                  ? [
                      across !== undefined ? `across ${across}` : null,
                      down !== undefined ? `down ${down}` : null,
                    ]
                      .filter(Boolean)
                      .join(', ')
                  : 'block'
              }
              className={cn(
                'relative aspect-square bg-kk-block text-[2.6cqw] font-semibold text-kk-clue',
                hasClue &&
                  'bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--kk-line)_50%,transparent_calc(50%+0.5px))]',
              )}
            >
              {across !== undefined && (
                <span className="absolute top-0.5 right-1">{across}</span>
              )}
              {down !== undefined && (
                <span className="absolute bottom-0.5 left-1">{down}</span>
              )}
            </div>
          )
        }
        const value = values[cell]
        const given = puzzle.givens.has(cell)
        const isWrong = wrong.has(cell)
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={[
              `Row ${row} column ${column}`,
              value !== 0 ? String(value) : 'empty',
              given ? 'given' : null,
              isWrong ? 'wrong' : null,
              marked.has(cell) ? 'marked' : null,
              cell === selected ? 'selected' : null,
            ]
              .filter(Boolean)
              .join(', ')}
            aria-selected={cell === selected}
            onClick={() => onCell(cell)}
            className={cn(
              'relative flex aspect-square items-center justify-center bg-kk-background text-[5cqw] text-kk-digit',
              cell === selected
                ? 'bg-kk-selected'
                : sameDigit.has(cell)
                  ? 'bg-kk-same-digit'
                  : given
                    ? 'bg-kk-given'
                    : runCells.has(cell) && 'bg-kk-run',
              isWrong && 'text-kk-wrong',
              marked.has(cell) && 'ring-2 ring-kk-trial-mark ring-inset',
            )}
          >
            {value !== 0 ? (
              value
            ) : notes[cell] !== 0 ? (
              <span className="grid size-full grid-cols-3 p-0.5 text-[1.8cqw] leading-none text-kk-note">
                {NOTE_POSITIONS.map((digit) => (
                  <span
                    key={digit}
                    className="flex items-center justify-center"
                  >
                    {(notes[cell] & bit(digit)) !== 0 ? digit : ''}
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
