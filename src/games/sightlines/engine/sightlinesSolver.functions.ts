import {
  DIRECTIONS,
  DOT,
  REASON,
} from '@/games/sightlines/engine/sightlines.constants'
import type {
  Deduction,
  Direction,
  Grid,
} from '@/games/sightlines/engine/sightlines.types'
import {
  dotAt,
  isFull,
  ray,
  reach,
  seen,
  seenAll,
  withDot,
} from '@/games/sightlines/engine/sightlinesGrid.functions'

export function nextDeduction({
  grid,
  numbers,
}: {
  grid: Grid
  numbers: Map<number, number>
}): Deduction | null {
  const targets: { cell: number; number: number; exact: boolean }[] = [
    ...[...numbers].map(([cell, number]) => ({ cell, number, exact: true })),
    ...[...grid.dots].flatMap((dot, cell) =>
      dot === DOT.BLUE && !numbers.has(cell)
        ? [{ cell, number: 1, exact: false }]
        : [],
    ),
  ]
  return (
    firstOf({ targets, find: (target) => satisfied({ grid, ...target }) }) ??
    firstOf({ targets, find: (target) => tooMany({ grid, ...target }) }) ??
    firstOf({ targets, find: (target) => needs({ grid, ...target }) }) ??
    alone(grid)
  )
}

export function solveLogically({
  start,
  numbers,
}: {
  start: Grid
  numbers: Map<number, number>
}): Grid | null {
  let grid = start
  while (!isFull(grid)) {
    const deduction = nextDeduction({ grid, numbers })
    if (deduction === null) {
      return null
    }
    grid = deduction.cells.reduce(
      (next, cell) => withDot({ grid: next, cell, dot: deduction.dot }),
      grid,
    )
  }
  return grid
}

function alone(grid: Grid): Deduction | null {
  for (let cell = 0; cell < grid.dots.length; cell++) {
    if (
      dotAt({ grid, cell }) === DOT.EMPTY &&
      DIRECTIONS.every((direction) => reach({ grid, cell, direction }) === 0)
    ) {
      return { cells: [cell], dot: DOT.RED, reason: REASON.ALONE, source: cell }
    }
  }
  return null
}

function closingEnd({
  grid,
  cell,
  direction,
}: {
  grid: Grid
  cell: number
  direction: Direction
}): number | null {
  const end = ray({ grid, cell, direction })[seen({ grid, cell, direction })]
  return end !== undefined && dotAt({ grid, cell: end }) === DOT.EMPTY
    ? end
    : null
}

function firstOf<T>({
  targets,
  find,
}: {
  targets: T[]
  find: (target: T) => Deduction | null
}): Deduction | null {
  for (const target of targets) {
    const found = find(target)
    if (found !== null) {
      return found
    }
  }
  return null
}

function needs({
  grid,
  cell,
  number,
}: {
  grid: Grid
  cell: number
  number: number
}): Deduction | null {
  for (const direction of DIRECTIONS) {
    const others = DIRECTIONS.filter((it) => it !== direction).reduce(
      (sum, it) => sum + reach({ grid, cell, direction: it }),
      0,
    )
    if (number - others > seen({ grid, cell, direction })) {
      const end = closingEnd({ grid, cell, direction })
      if (end === null) {
        continue
      }
      return { cells: [end], dot: DOT.BLUE, reason: REASON.NEEDS, source: cell }
    }
  }
  return null
}

function satisfied({
  grid,
  cell,
  number,
  exact,
}: {
  grid: Grid
  cell: number
  number: number
  exact: boolean
}): Deduction | null {
  if (!exact || seenAll({ grid, cell }) !== number) {
    return null
  }
  const ends = DIRECTIONS.map((direction) =>
    closingEnd({ grid, cell, direction }),
  ).filter((end) => end !== null)
  return ends.length > 0
    ? { cells: ends, dot: DOT.RED, reason: REASON.SATISFIED, source: cell }
    : null
}

function tooMany({
  grid,
  cell,
  number,
  exact,
}: {
  grid: Grid
  cell: number
  number: number
  exact: boolean
}): Deduction | null {
  if (!exact) {
    return null
  }
  const seenNow = seenAll({ grid, cell })
  for (const direction of DIRECTIONS) {
    const end = closingEnd({ grid, cell, direction })
    if (end === null) {
      continue
    }
    const beyond = seen({ grid, cell: end, direction })
    if (seenNow + 1 + beyond > number) {
      return {
        cells: [end],
        dot: DOT.RED,
        reason: REASON.TOO_MANY,
        source: cell,
      }
    }
  }
  return null
}
