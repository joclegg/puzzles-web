import { COLOURS, RUN, TILE } from '@/common/twoTone/twoTone.constants'
import type { Grid, Line, Tile } from '@/common/twoTone/twoTone.types'

export function brokenCells(grid: Grid): Set<number> {
  const broken = new Set<number>()
  for (const line of linesOf(grid)) {
    const cells = cellsOf({ grid, line })
    const tiles = tilesOf({ grid, line })
    for (let start = 0; start <= grid.size - RUN; start++) {
      if (isRun(tiles.slice(start, start + RUN))) {
        cells.slice(start, start + RUN).forEach((cell) => broken.add(cell))
      }
    }
    for (const colour of COLOURS) {
      if (countOf({ tiles, tile: colour }) > grid.size / 2) {
        cells
          .filter((cell) => tileAt({ grid, cell }) === colour)
          .forEach((cell) => broken.add(cell))
      }
    }
    if (!tiles.includes(TILE.EMPTY) && hasTwin({ grid, line, tiles })) {
      cells.forEach((cell) => broken.add(cell))
    }
  }
  return broken
}

export function hasBrokenRule(grid: Grid): boolean {
  for (const line of linesOf(grid)) {
    const tiles = tilesOf({ grid, line })
    for (let start = 0; start <= grid.size - RUN; start++) {
      if (isRun(tiles.slice(start, start + RUN))) {
        return true
      }
    }
    if (
      COLOURS.some((colour) => countOf({ tiles, tile: colour }) > grid.size / 2)
    ) {
      return true
    }
    if (!tiles.includes(TILE.EMPTY) && hasTwin({ grid, line, tiles })) {
      return true
    }
  }
  return false
}

export function cellsOf({ grid, line }: { grid: Grid; line: Line }) {
  return Array.from({ length: grid.size }, (_, position) =>
    line.isRow
      ? line.index * grid.size + position
      : position * grid.size + line.index,
  )
}

export function countOf({ tiles, tile }: { tiles: string; tile: Tile }) {
  let count = 0
  for (const it of tiles) {
    if (it === tile) {
      count++
    }
  }
  return count
}

export function emptyGrid(size: number): Grid {
  return { size, tiles: TILE.EMPTY.repeat(size * size) }
}

export function hasTwin({
  grid,
  line,
  tiles,
}: {
  grid: Grid
  line: Line
  tiles: string
}): boolean {
  for (let index = 0; index < grid.size; index++) {
    if (
      index !== line.index &&
      tilesOf({ grid, line: { isRow: line.isRow, index } }) === tiles
    ) {
      return true
    }
  }
  return false
}

export function isFull(grid: Grid): boolean {
  return !grid.tiles.includes(TILE.EMPTY)
}

export function isRun(run: string): boolean {
  return run[0] !== TILE.EMPTY && run[1] === run[0] && run[2] === run[0]
}

export function linesOf(grid: Grid): Line[] {
  return Array.from({ length: grid.size }, (_, index) => [
    { isRow: true, index },
    { isRow: false, index },
  ]).flat()
}

export function parseGrid({ size, text }: { size: number; text: string }) {
  return { size, tiles: text.replace(/\s/g, '') }
}

export function sameLine({ a, b }: { a: Line; b: Line }): boolean {
  return a.isRow === b.isRow && a.index === b.index
}

export function tileAt({ grid, cell }: { grid: Grid; cell: number }): Tile {
  return grid.tiles[cell] as Tile
}

export function tilesOf({ grid, line }: { grid: Grid; line: Line }): string {
  if (line.isRow) {
    const start = line.index * grid.size
    return grid.tiles.slice(start, start + grid.size)
  }
  let tiles = ''
  for (let position = 0; position < grid.size; position++) {
    tiles += grid.tiles[position * grid.size + line.index]
  }
  return tiles
}

export function withTile({
  grid,
  cell,
  tile,
}: {
  grid: Grid
  cell: number
  tile: Tile
}): Grid {
  return {
    size: grid.size,
    tiles: grid.tiles.slice(0, cell) + tile + grid.tiles.slice(cell + 1),
  }
}
