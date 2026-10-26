import { ENTRY_PROBLEM, STANDARD_GRID } from '@/common/sudoku/sudoku.constants'
import type {
  Cage,
  Difficulty,
  EntryProblem,
} from '@/common/sudoku/sudoku.types'
import { grade } from '@/common/sudoku/sudokuGrader.functions'
import {
  cageCombos,
  countSolutions,
  isConsistent,
  solveGrid,
} from '@/common/sudoku/sudokuSolver.functions'

const MAX_SOLVER_STEPS = 200_000

export function cageProblem({
  cells,
  sum,
}: {
  cells: number[]
  sum: number | null
}) {
  if (cells.length === 0 || sum === null) {
    return ENTRY_PROBLEM.EMPTY
  }
  if (!isConnected(cells)) {
    return ENTRY_PROBLEM.NOT_CONNECTED
  }
  if (
    cageCombos({
      size: cells.length,
      sum,
      allowedDigits: STANDARD_GRID.allDigits,
    }).length === 0
  ) {
    return ENTRY_PROBLEM.IMPOSSIBLE_SUM
  }
  return null
}

export function checkPuzzle({
  givens,
  cages,
}: {
  givens: number[]
  cages: Cage[]
}): {
  problem: EntryProblem | null
  solution: number[] | null
  level: Difficulty | null
} {
  if (!isConsistent({ givens, cages })) {
    return { problem: ENTRY_PROBLEM.NO_SOLUTION, solution: null, level: null }
  }
  const count = countSolutions({
    givens,
    cages,
    limit: 2,
    maxSteps: MAX_SOLVER_STEPS,
  })
  if (count === null) {
    return {
      problem: ENTRY_PROBLEM.TOO_HARD_TO_CHECK,
      solution: null,
      level: null,
    }
  }
  if (count === 0) {
    return { problem: ENTRY_PROBLEM.NO_SOLUTION, solution: null, level: null }
  }
  if (count > 1) {
    return {
      problem: ENTRY_PROBLEM.MULTIPLE_SOLUTIONS,
      solution: null,
      level: null,
    }
  }
  return {
    problem: null,
    solution: solveGrid({ givens, cages }),
    level: grade({ givens, cages }).level,
  }
}

export function isConnected(cells: number[]): boolean {
  const set = new Set(cells)
  const seen = new Set([cells[0]])
  const queue = [cells[0]]
  while (queue.length > 0) {
    const cell = queue.shift()!
    const row = Math.floor(cell / 9)
    const col = cell % 9
    const neighbours = [
      row > 0 ? cell - 9 : -1,
      row < 8 ? cell + 9 : -1,
      col > 0 ? cell - 1 : -1,
      col < 8 ? cell + 1 : -1,
    ]
    for (const next of neighbours) {
      if (set.has(next) && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return seen.size === set.size
}
