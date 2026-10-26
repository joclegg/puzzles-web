import { createRandom, shuffled } from '@/common/random.functions'
import type { Random } from '@/common/random.types'
import { COLOURS, RUN, TILE } from '@/common/twoTone/twoTone.constants'
import type { Grid, Line, Puzzle } from '@/common/twoTone/twoTone.types'
import {
  countOf,
  emptyGrid,
  hasTwin,
  isRun,
  parseGrid,
  tilesOf,
  withTile,
} from '@/common/twoTone/twoToneGrid.functions'
import { solveLogically } from '@/common/twoTone/twoToneSolver.functions'

export function decodePuzzle(text: string): Puzzle {
  const [size, givens, solution] = text.split(';')
  return {
    givens: parseGrid({ size: Number(size), text: givens }),
    solution: parseGrid({ size: Number(size), text: solution }),
  }
}

export function encodePuzzle(puzzle: Puzzle): string {
  return `${puzzle.givens.size};${puzzle.givens.tiles};${puzzle.solution.tiles}`
}

export function generatePuzzle({
  size,
  seed,
}: {
  size: number
  seed: bigint
}): Puzzle {
  const random = createRandom(seed)
  const solution = fill({ grid: emptyGrid(size), cell: 0, random })
  if (solution === null) {
    throw new Error(`No ${size} x ${size} grid could be filled`)
  }
  let givens = solution
  const cells = Array.from({ length: solution.tiles.length }, (_, i) => i)
  for (const cell of shuffled({ items: cells, random })) {
    const without = withTile({ grid: givens, cell, tile: TILE.EMPTY })
    if (solveLogically(without)?.tiles === solution.tiles) {
      givens = without
    }
  }
  return { givens, solution }
}

function fill({
  grid,
  cell,
  random,
}: {
  grid: Grid
  cell: number
  random: Random
}): Grid | null {
  if (cell === grid.tiles.length) {
    return grid
  }
  for (const tile of shuffled({ items: COLOURS, random })) {
    const next = withTile({ grid, cell, tile })
    if (fits({ grid: next, cell })) {
      const filled = fill({ grid: next, cell: cell + 1, random })
      if (filled !== null) {
        return filled
      }
    }
  }
  return null
}

function fits({ grid, cell }: { grid: Grid; cell: number }): boolean {
  const row: Line = { isRow: true, index: Math.floor(cell / grid.size) }
  const column: Line = { isRow: false, index: cell % grid.size }
  return [row, column].every((line) => {
    const tiles = tilesOf({ grid, line })
    for (let start = 0; start <= grid.size - RUN; start++) {
      if (isRun(tiles.slice(start, start + RUN))) {
        return false
      }
    }
    const balanced = COLOURS.every(
      (tile) => countOf({ tiles, tile }) <= grid.size / 2,
    )
    const unique = tiles.includes(TILE.EMPTY) || !hasTwin({ grid, line, tiles })
    return balanced && unique
  })
}
