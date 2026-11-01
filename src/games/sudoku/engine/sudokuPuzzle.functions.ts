import {
  FAST_GRID,
  NO_CAGE,
  STANDARD_GRID,
} from '@/games/sudoku/engine/sudoku.constants'
import type { Cage, Grid, Puzzle } from '@/games/sudoku/engine/sudoku.types'

export function bitCount(mask: number): number {
  let count = 0
  for (let rest = mask; rest !== 0; rest &= rest - 1) {
    count++
  }
  return count
}

export function createPuzzle({
  givens,
  solution = null,
  cages = [],
}: {
  givens: number[]
  solution?: number[] | null
  cages?: Cage[]
}): Puzzle {
  const cageIndexByCell = givens.map(() => NO_CAGE)
  cages.forEach((cage, index) =>
    cage.cells.forEach((cell) => (cageIndexByCell[cell] = index)),
  )
  return {
    givens,
    solution,
    cages,
    grid: gridFor(givens.length),
    cageIndexByCell,
  }
}

export function decodePuzzle(line: string): Puzzle {
  const [givens = '', solution = '', cages = ''] = line.trim().split('|')
  return createPuzzle({
    givens: [...givens].map(Number),
    solution: solution.length > 0 ? [...solution].map(Number) : null,
    cages: cages
      .split(';')
      .filter((it) => it.length > 0)
      .map((cage) => {
        const [sum, cells] = cage.split(':')
        return { sum: Number(sum), cells: cells.split(',').map(Number) }
      }),
  })
}

export function digitBit(digit: number): number {
  return 1 << digit
}

export function digitsOf(mask: number): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (digit) => (mask & digitBit(digit)) !== 0,
  )
}

export function encodePuzzle(puzzle: Puzzle): string {
  const cages = puzzle.cages
    .map((cage) => `${cage.sum}:${cage.cells.join(',')}`)
    .join(';')
  return `${puzzle.givens.join('')}|${puzzle.solution?.join('') ?? ''}|${cages}`
}

export function gridFor(cells: number): Grid {
  return cells === FAST_GRID.cells ? FAST_GRID : STANDARD_GRID
}

export function singleDigit(mask: number): number {
  return 31 - Math.clz32(mask & -mask)
}
