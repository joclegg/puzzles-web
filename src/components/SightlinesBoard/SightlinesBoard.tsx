import { cn } from '@/common/utils.functions'
import { DOT } from '@/common/sightlines/sightlines.constants'
import type { Dot } from '@/common/sightlines/sightlines.types'
import {
  DOT_CLASS,
  DOT_NAME,
  GRID_COLUMNS_CLASS,
} from '@/components/SightlinesBoard/SightlinesBoard.constants'

export function SightlinesBoard({
  size,
  dots,
  numbers,
  walls,
  seen,
  broken,
  hintLine,
  hintTargets,
  onDot,
}: {
  size: number
  dots: string
  numbers: Map<number, number>
  walls: Set<number>
  seen: Map<number, number> | null
  broken: Set<number>
  hintLine: Set<number>
  hintTargets: Set<number>
  onDot: (cell: number) => void
}) {
  return (
    <div
      role="grid"
      aria-label="Board"
      className={cn(
        'grid w-full max-w-md gap-1.5 lg:max-w-[min(100%,calc(100dvh-16rem))]',
        GRID_COLUMNS_CLASS[size],
      )}
    >
      {[...dots].map((value, cell) => {
        const dot = value as Dot
        const number = numbers.get(cell)
        const hinted = hintTargets.has(cell)
        const label = [
          `Row ${Math.floor(cell / size) + 1} column ${(cell % size) + 1}`,
          DOT_NAME[dot],
          number !== undefined ? `number ${number}` : null,
          walls.has(cell) ? 'given' : null,
          broken.has(cell) ? 'breaks a rule' : null,
          hinted ? 'hint' : null,
        ]
          .filter(Boolean)
          .join(', ')
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={label}
            onClick={() => onDot(cell)}
            className={cn(
              'relative flex aspect-square items-center justify-center rounded-full border-b-4 text-xl font-bold text-sl-number transition-colors',
              DOT_CLASS[dot],
              dot === DOT.EMPTY &&
                hintLine.has(cell) &&
                'border-b-sl-hint-line bg-sl-hint-line',
              hinted
                ? 'ring-3 ring-sl-hint-target'
                : broken.has(cell) && 'ring-3 ring-sl-broken',
            )}
          >
            {number}
            {number !== undefined && seen && (
              <span className="absolute right-1 bottom-0 text-[0.6rem] font-medium opacity-80">
                {seen.get(cell)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
