import { DIRECTIONS, DOT } from '@/games/sightlines/engine/sightlines.constants'
import type {
  Direction,
  Dot,
  Grid,
} from '@/games/sightlines/engine/sightlines.types'

export function dotAt({ grid, cell }: { grid: Grid; cell: number }): Dot {
  return grid.dots[cell] as Dot
}

export function isFull(grid: Grid): boolean {
  return !grid.dots.includes(DOT.EMPTY)
}

export function parseGrid({ size, text }: { size: number; text: string }) {
  return { size, dots: text.replace(/\s/g, '') }
}

export function ray({
  grid,
  cell,
  direction,
}: {
  grid: Grid
  cell: number
  direction: Direction
}): number[] {
  const cells: number[] = []
  let row = Math.floor(cell / grid.size) + direction.rowStep
  let col = (cell % grid.size) + direction.colStep
  while (row >= 0 && row < grid.size && col >= 0 && col < grid.size) {
    cells.push(row * grid.size + col)
    row += direction.rowStep
    col += direction.colStep
  }
  return cells
}

export function reach({
  grid,
  cell,
  direction,
}: {
  grid: Grid
  cell: number
  direction: Direction
}): number {
  return countWhile({
    cells: ray({ grid, cell, direction }),
    keep: (it) => grid.dots[it] !== DOT.RED,
  })
}

export function seen({
  grid,
  cell,
  direction,
}: {
  grid: Grid
  cell: number
  direction: Direction
}): number {
  return countWhile({
    cells: ray({ grid, cell, direction }),
    keep: (it) => grid.dots[it] === DOT.BLUE,
  })
}

export function seenAll({ grid, cell }: { grid: Grid; cell: number }) {
  return DIRECTIONS.reduce(
    (sum, direction) => sum + seen({ grid, cell, direction }),
    0,
  )
}

export function totalReach({ grid, cell }: { grid: Grid; cell: number }) {
  return DIRECTIONS.reduce(
    (sum, direction) => sum + reach({ grid, cell, direction }),
    0,
  )
}

export function withDot({
  grid,
  cell,
  dot,
}: {
  grid: Grid
  cell: number
  dot: Dot
}): Grid {
  return {
    size: grid.size,
    dots: grid.dots.slice(0, cell) + dot + grid.dots.slice(cell + 1),
  }
}

function countWhile({
  cells,
  keep,
}: {
  cells: number[]
  keep: (cell: number) => boolean
}): number {
  const stop = cells.findIndex((cell) => !keep(cell))
  return stop === -1 ? cells.length : stop
}
