import { DOT, RADIX, WALL } from '@/common/sightlines/sightlines.constants'
import type { Grid, Puzzle } from '@/common/sightlines/sightlines.types'
import {
  dotAt,
  parseGrid,
  seenAll,
  totalReach,
} from '@/common/sightlines/sightlinesGrid.functions'

export function brokenCells({ puzzle, grid }: { puzzle: Puzzle; grid: Grid }) {
  const broken = new Set<number>()
  for (let cell = 0; cell < grid.dots.length; cell++) {
    const number = puzzle.numbers.get(cell)
    const reachable = totalReach({ grid, cell })
    const isBroken =
      number !== undefined
        ? seenAll({ grid, cell }) > number || reachable < number
        : dotAt({ grid, cell }) === DOT.BLUE && reachable === 0
    if (isBroken) {
      broken.add(cell)
    }
  }
  return broken
}

export function decodePuzzle(text: string): Puzzle {
  const [size, clues, solution] = text.split(';')
  const numbers = new Map<number, number>()
  const walls = new Set<number>()
  ;[...clues].forEach((code, cell) => {
    if (code === WALL) {
      walls.add(cell)
    } else if (code !== '.') {
      numbers.set(cell, parseInt(code, RADIX))
    }
  })
  return {
    solution: parseGrid({ size: Number(size), text: solution }),
    numbers,
    walls,
  }
}

export function encodePuzzle(puzzle: Puzzle): string {
  const clues = [...puzzle.solution.dots]
    .map((_, cell) =>
      puzzle.numbers.has(cell)
        ? puzzle.numbers.get(cell)!.toString(RADIX)
        : puzzle.walls.has(cell)
          ? WALL
          : '.',
    )
    .join('')
  return `${puzzle.solution.size};${clues};${puzzle.solution.dots}`
}

export function givensOf(puzzle: Puzzle): Grid {
  const dots = [...puzzle.solution.dots]
    .map((_, cell) =>
      puzzle.numbers.has(cell)
        ? DOT.BLUE
        : puzzle.walls.has(cell)
          ? DOT.RED
          : DOT.EMPTY,
    )
    .join('')
  return { size: puzzle.solution.size, dots }
}

export function isGiven({ puzzle, cell }: { puzzle: Puzzle; cell: number }) {
  return puzzle.numbers.has(cell) || puzzle.walls.has(cell)
}
