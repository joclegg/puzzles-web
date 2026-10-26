import { createRandom, randomItem, shuffled } from '@/common/random.functions'
import type { Random } from '@/common/random.types'
import {
  DIRECTIONS,
  DOT,
  RED_CHANCE,
} from '@/common/sightlines/sightlines.constants'
import type { Grid, Puzzle } from '@/common/sightlines/sightlines.types'
import {
  dotAt,
  ray,
  seen,
  seenAll,
  withDot,
} from '@/common/sightlines/sightlinesGrid.functions'
import { givensOf } from '@/common/sightlines/sightlinesPuzzle.functions'
import { solveLogically } from '@/common/sightlines/sightlinesSolver.functions'

export function generatePuzzle({
  size,
  seed,
}: {
  size: number
  seed: bigint
}): Puzzle {
  const random = createRandom(seed)
  const solution = makeSolution({ size, random })
  const cells = Array.from({ length: solution.dots.length }, (_, i) => i)
  let numbers = new Map(
    cells
      .filter((cell) => dotAt({ grid: solution, cell }) === DOT.BLUE)
      .map((cell) => [cell, seenAll({ grid: solution, cell })]),
  )
  let walls = new Set(
    cells.filter((cell) => dotAt({ grid: solution, cell }) === DOT.RED),
  )
  for (const cell of shuffled({ items: cells, random })) {
    const fewerNumbers = new Map(numbers)
    fewerNumbers.delete(cell)
    const fewerWalls = new Set(walls)
    fewerWalls.delete(cell)
    const candidate = { solution, numbers: fewerNumbers, walls: fewerWalls }
    const solved = solveLogically({
      start: givensOf(candidate),
      numbers: fewerNumbers,
    })
    if (solved?.dots === solution.dots) {
      numbers = fewerNumbers
      walls = fewerWalls
    }
  }
  return { solution, numbers, walls }
}

function makeSolution({ size, random }: { size: number; random: Random }) {
  let grid: Grid = {
    size,
    dots: Array.from({ length: size * size }, () =>
      random.nextDouble() < RED_CHANCE ? DOT.RED : DOT.BLUE,
    ).join(''),
  }
  for (;;) {
    const blues = [...grid.dots].flatMap((dot, cell) =>
      dot === DOT.BLUE ? [cell] : [],
    )
    const lonely = blues.find((cell) => seenAll({ grid, cell }) === 0)
    if (lonely !== undefined) {
      grid = withDot({ grid, cell: lonely, dot: DOT.RED })
      continue
    }
    const crowded = blues.find((cell) => seenAll({ grid, cell }) > size)
    if (crowded === undefined) {
      return grid
    }
    const current = grid
    const inView = DIRECTIONS.flatMap((direction) =>
      ray({ grid: current, cell: crowded, direction }).slice(
        0,
        seen({ grid: current, cell: crowded, direction }),
      ),
    )
    grid = withDot({
      grid,
      cell: randomItem({ items: inView, random }),
      dot: DOT.RED,
    })
  }
}
