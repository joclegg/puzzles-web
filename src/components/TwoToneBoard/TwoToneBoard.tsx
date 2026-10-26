import { cn } from '@/common/utils.functions'
import { TILE } from '@/common/twoTone/twoTone.constants'
import type { Tile } from '@/common/twoTone/twoTone.types'
import {
  GRID_COLUMNS_CLASS,
  TILE_CLASS,
  TILE_NAME,
} from '@/components/TwoToneBoard/TwoToneBoard.constants'

export function TwoToneBoard({
  size,
  tiles,
  givens,
  showGivens,
  broken,
  hintLine,
  hintTargets,
  onTile,
}: {
  size: number
  tiles: string
  givens: string
  showGivens: boolean
  broken: Set<number>
  hintLine: Set<number>
  hintTargets: Set<number>
  onTile: (cell: number) => void
}) {
  return (
    <div
      role="grid"
      aria-label="Board"
      className={cn(
        'grid aspect-square w-full max-w-md gap-1 sm:gap-1.5 lg:max-w-[min(100%,calc(100dvh-16rem))]',
        GRID_COLUMNS_CLASS[size],
      )}
    >
      {[...tiles].map((value, cell) => {
        const tile = value as Tile
        const given = givens[cell] !== TILE.EMPTY
        const hinted = hintTargets.has(cell)
        const label = [
          `Row ${Math.floor(cell / size) + 1} column ${(cell % size) + 1}`,
          TILE_NAME[tile],
          given ? 'given' : null,
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
            onClick={() => onTile(cell)}
            className={cn(
              'relative rounded-md border-b-4 transition-colors',
              TILE_CLASS[tile],
              tile === TILE.EMPTY &&
                hintLine.has(cell) &&
                'border-b-tt-hint-line bg-tt-hint-line',
              hinted
                ? 'ring-3 ring-tt-hint-target'
                : broken.has(cell) && 'ring-3 ring-tt-broken',
            )}
          >
            {given && showGivens && (
              <span className="absolute inset-0 m-auto size-1.5 rounded-full bg-white/60" />
            )}
          </button>
        )
      })}
    </div>
  )
}
