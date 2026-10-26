import { DIGITS, MAX_DIGIT } from '@/common/kakuro/kakuro.constants'
import type { Puzzle, Run } from '@/common/kakuro/kakuro.types'

const MASKS_BY_RUN = groupMasks()

export function bit(digit: number): number {
  return 1 << (digit - 1)
}

export function createPuzzle({
  size,
  solution,
  givens = new Set(),
}: {
  size: number
  solution: number[]
  givens?: Set<number>
}): Puzzle {
  const isWhite = solution.map((digit) => digit !== 0)
  const runs = findRuns({ size, solution, isWhite })
  const runsOf = new Map<number, Run[]>()
  for (const run of runs) {
    for (const cell of run.cells) {
      runsOf.set(cell, [...(runsOf.get(cell) ?? []), run])
    }
  }
  return {
    size,
    solution,
    givens,
    isWhite,
    runs,
    runsOf,
    acrossClues: new Map(
      runs.filter((run) => run.isAcross).map((run) => [run.clueCell, run.sum]),
    ),
    downClues: new Map(
      runs.filter((run) => !run.isAcross).map((run) => [run.clueCell, run.sum]),
    ),
  }
}

export function decodePuzzle(text: string): Puzzle {
  const [size, solution, givens] = text.split(';')
  return createPuzzle({
    size: Number(size),
    solution: [...solution].map(Number),
    givens: new Set(
      givens
        .split(',')
        .filter((it) => it.length > 0)
        .map(Number),
    ),
  })
}

export function digitsOf(mask: number): number[] {
  return DIGITS.filter((digit) => (mask & bit(digit)) !== 0)
}

export function encodePuzzle(puzzle: Puzzle): string {
  const givens = [...puzzle.givens].sort((a, b) => a - b).join(',')
  return `${puzzle.size};${puzzle.solution.join('')};${givens}`
}

export function masksFor({ length, sum }: { length: number; sum: number }) {
  return MASKS_BY_RUN.get(`${length}:${sum}`) ?? []
}

function bitCount(mask: number): number {
  let count = 0
  for (let rest = mask; rest !== 0; rest &= rest - 1) {
    count++
  }
  return count
}

function findRuns({
  size,
  solution,
  isWhite,
}: {
  size: number
  solution: number[]
  isWhite: boolean[]
}): Run[] {
  return [true, false].flatMap((isAcross) =>
    Array.from({ length: size }, (_, line) => {
      const cells = Array.from({ length: size }, (_, position) =>
        isAcross ? line * size + position : position * size + line,
      )
      return segments({ cells, isWhite }).map((run) => ({
        cells: run,
        sum: run.reduce((total, cell) => total + solution[cell], 0),
        isAcross,
        clueCell: isAcross ? run[0] - 1 : run[0] - size,
      }))
    }).flat(),
  )
}

function groupMasks(): Map<string, number[]> {
  const groups = new Map<string, number[]>()
  for (let mask = 1; mask < 1 << MAX_DIGIT; mask++) {
    const sum = digitsOf(mask).reduce((total, digit) => total + digit, 0)
    const key = `${bitCount(mask)}:${sum}`
    groups.set(key, [...(groups.get(key) ?? []), mask])
  }
  return groups
}

function segments({
  cells,
  isWhite,
}: {
  cells: number[]
  isWhite: boolean[]
}): number[][] {
  const found: number[][] = []
  let current: number[] = []
  for (const cell of [...cells, -1]) {
    if (cell >= 0 && isWhite[cell]) {
      current.push(cell)
    } else {
      if (current.length > 1) {
        found.push(current)
      }
      current = []
    }
  }
  return found
}
