import type { Grid, Puzzle } from '@/games/sudoku/engine/sudoku.types'

export function boxEdges({ grid, cell }: { grid: Grid; cell: number }) {
  const row = grid.rowOf[cell]
  const col = grid.colOf[cell]
  return {
    thickRight: col < grid.size - 1 && (col + 1) % grid.boxCols === 0,
    thickBottom: row < grid.size - 1 && (row + 1) % grid.boxRows === 0,
    lastCol: col === grid.size - 1,
    lastRow: row === grid.size - 1,
  }
}

export function cageSides({ puzzle, cell }: { puzzle: Puzzle; cell: number }) {
  const cage = puzzle.cageIndexByCell[cell]
  const grid = puzzle.grid
  const row = grid.rowOf[cell]
  const col = grid.colOf[cell]
  function differs(other: number | null) {
    return other === null || puzzle.cageIndexByCell[other] !== cage
  }
  return {
    top: differs(row > 0 ? cell - grid.size : null),
    right: differs(col < grid.size - 1 ? cell + 1 : null),
    bottom: differs(row < grid.size - 1 ? cell + grid.size : null),
    left: differs(col > 0 ? cell - 1 : null),
  }
}

export function cageSumCells(puzzle: Puzzle): Map<number, number> {
  return new Map(
    puzzle.cages.map((cage, index) => [Math.min(...cage.cells), index]),
  )
}
