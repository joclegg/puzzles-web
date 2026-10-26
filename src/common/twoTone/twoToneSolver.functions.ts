import {
  COLOURS,
  OTHER_TILE,
  REASON,
  RUN,
  TILE,
} from '@/common/twoTone/twoTone.constants'
import type {
  Deduction,
  Grid,
  Line,
  Tile,
} from '@/common/twoTone/twoTone.types'
import {
  cellsOf,
  countOf,
  hasBrokenRule,
  isFull,
  linesOf,
  sameLine,
  tileAt,
  tilesOf,
  withTile,
} from '@/common/twoTone/twoToneGrid.functions'

export function nextDeduction(grid: Grid): Deduction | null {
  const lines = linesOf(grid)
  return (
    firstOf({ lines, find: (line) => pairOrGap({ grid, line }) }) ??
    firstOf({ lines, find: (line) => balance({ grid, line }) }) ??
    firstOf({ lines, find: (line) => unique({ grid, line }) })
  )
}

export function solveLogically(grid: Grid): Grid | null {
  let current = grid
  while (!isFull(current)) {
    const deduction = nextDeduction(current)
    if (deduction === null) {
      return null
    }
    current = deduction.cells.reduce(
      (next, cell) => withTile({ grid: next, cell, tile: deduction.tile }),
      current,
    )
    if (hasBrokenRule(current)) {
      return null
    }
  }
  return current
}

function balance({ grid, line }: { grid: Grid; line: Line }) {
  const tiles = tilesOf({ grid, line })
  if (!tiles.includes(TILE.EMPTY)) {
    return null
  }
  const full = COLOURS.find(
    (tile) => countOf({ tiles, tile }) === grid.size / 2,
  )
  if (full === undefined) {
    return null
  }
  const empties = cellsOf({ grid, line }).filter(
    (cell) => tileAt({ grid, cell }) === TILE.EMPTY,
  )
  return {
    cells: empties,
    tile: OTHER_TILE[full],
    reason: REASON.BALANCE,
    line,
  }
}

function firstOf({
  lines,
  find,
}: {
  lines: Line[]
  find: (line: Line) => Deduction | null
}): Deduction | null {
  for (const line of lines) {
    const found = find(line)
    if (found !== null) {
      return found
    }
  }
  return null
}

function pairOrGap({ grid, line }: { grid: Grid; line: Line }) {
  const cells = cellsOf({ grid, line })
  const tiles = tilesOf({ grid, line })
  for (let start = 0; start <= grid.size - RUN; start++) {
    const [a, b, c] = tiles.slice(start, start + RUN)
    const target =
      a === TILE.EMPTY && b !== TILE.EMPTY && b === c
        ? { at: start, reason: REASON.PAIR }
        : c === TILE.EMPTY && a !== TILE.EMPTY && a === b
          ? { at: start + 2, reason: REASON.PAIR }
          : b === TILE.EMPTY && a !== TILE.EMPTY && a === c
            ? { at: start + 1, reason: REASON.GAP }
            : null
    if (target !== null) {
      const filled = [a, b, c].find((tile) => tile !== TILE.EMPTY) as Tile
      return {
        cells: [cells[target.at]],
        tile: OTHER_TILE[filled],
        reason: target.reason,
        line,
      }
    }
  }
  return null
}

function unique({ grid, line }: { grid: Grid; line: Line }) {
  const cells = cellsOf({ grid, line })
  const tiles = tilesOf({ grid, line })
  const empties = cells.filter((cell) => tileAt({ grid, cell }) === TILE.EMPTY)
  if (empties.length !== 2) {
    return null
  }
  if (grid.size / 2 - countOf({ tiles, tile: TILE.RED }) !== 1) {
    return null
  }
  const twins = linesOf(grid).filter(
    (other) =>
      !sameLine({ a: other, b: line }) &&
      other.isRow === line.isRow &&
      !tilesOf({ grid, line: other }).includes(TILE.EMPTY),
  )
  for (const twin of twins) {
    const twinTiles = tilesOf({ grid, line: twin })
    const matchesFilled = [...tiles].every(
      (tile, i) => tile === TILE.EMPTY || tile === twinTiles[i],
    )
    if (matchesFilled) {
      const first = cells.indexOf(empties[0])
      return {
        cells: [empties[0]],
        tile: OTHER_TILE[twinTiles[first] as Tile],
        reason: REASON.UNIQUE,
        line,
      }
    }
  }
  return null
}
