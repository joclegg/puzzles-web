import { NO_CAGE } from '@/common/sudoku/sudoku.constants'
import type { Cage } from '@/common/sudoku/sudoku.types'
import {
  bitCount,
  digitBit,
  digitsOf,
  gridFor,
} from '@/common/sudoku/sudokuPuzzle.functions'
import { shuffled } from '@/common/random.functions'
import type { Random } from '@/common/random.types'

const COMBOS: number[][][] = Array.from({ length: 10 }, (_, size) =>
  Array.from({ length: 46 }, (_, sum) => {
    const masks: number[] = []
    for (let mask = 0; mask < 1024; mask += 2) {
      if (
        bitCount(mask) === size &&
        digitsOf(mask).reduce((a, b) => a + b, 0) === sum
      ) {
        masks.push(mask)
      }
    }
    return masks
  }),
)

export function cageCombos({
  size,
  sum,
  allowedDigits,
}: {
  size: number
  sum: number
  allowedDigits: number
}): number[] {
  if (size < 0 || size > 9 || sum < 0 || sum > 45) {
    return []
  }
  return COMBOS[size][sum].filter((combo) => (combo & allowedDigits) === combo)
}

export function countSolutions({
  givens,
  cages = [],
  limit = 2,
  maxSteps = Number.MAX_SAFE_INTEGER,
}: {
  givens: number[]
  cages?: Cage[]
  limit?: number
  maxSteps?: number
}): number | null {
  const solver = createSolver({ givens, cages })
  if (!solver.consistent) {
    return 0
  }
  let count = 0
  const finished = solver.search({
    maxSteps,
    random: null,
    onSolution: () => {
      count++
      return count >= limit
    },
  })
  return finished ? count : null
}

export function isConsistent({
  givens,
  cages = [],
}: {
  givens: number[]
  cages?: Cage[]
}) {
  return createSolver({ givens, cages }).consistent
}

export function solveGrid({
  givens,
  cages = [],
  random = null,
}: {
  givens: number[]
  cages?: Cage[]
  random?: Random | null
}): number[] | null {
  const solver = createSolver({ givens, cages })
  if (!solver.consistent) {
    return null
  }
  let result: number[] | null = null
  solver.search({
    maxSteps: Number.MAX_SAFE_INTEGER,
    random,
    onSolution: () => {
      result = [...solver.values]
      return true
    },
  })
  return result
}

function createSolver({ givens, cages }: { givens: number[]; cages: Cage[] }) {
  const grid = gridFor(givens.length)
  const values = Array.from({ length: grid.cells }, () => 0)
  const rowUsed = Array.from({ length: grid.size }, () => 0)
  const colUsed = Array.from({ length: grid.size }, () => 0)
  const boxUsed = Array.from({ length: grid.size }, () => 0)
  const cageOf = Array.from({ length: grid.cells }, () => NO_CAGE)
  const cageUsed = cages.map(() => 0)
  const cageRemaining = cages.map((cage) => cage.sum)
  const cageEmpty = cages.map((cage) => cage.cells.length)
  let stepsLeft = 0

  function candidates(cell: number): number {
    let mask =
      grid.allDigits &
      ~(
        rowUsed[grid.rowOf[cell]] |
        colUsed[grid.colOf[cell]] |
        boxUsed[grid.boxOf[cell]]
      )
    const cage = cageOf[cell]
    if (cage !== NO_CAGE) {
      let allowed = 0
      for (const combo of cageCombos({
        size: cageEmpty[cage],
        sum: cageRemaining[cage],
        allowedDigits: grid.allDigits,
      })) {
        if ((combo & cageUsed[cage]) === 0) {
          allowed |= combo
        }
      }
      mask &= allowed
    }
    return mask
  }

  function place({ cell, digit }: { cell: number; digit: number }) {
    const bit = digitBit(digit)
    values[cell] = digit
    rowUsed[grid.rowOf[cell]] |= bit
    colUsed[grid.colOf[cell]] |= bit
    boxUsed[grid.boxOf[cell]] |= bit
    const cage = cageOf[cell]
    if (cage !== NO_CAGE) {
      cageUsed[cage] |= bit
      cageRemaining[cage] -= digit
      cageEmpty[cage]--
    }
  }

  function unplace({ cell, digit }: { cell: number; digit: number }) {
    const bit = ~digitBit(digit)
    values[cell] = 0
    rowUsed[grid.rowOf[cell]] &= bit
    colUsed[grid.colOf[cell]] &= bit
    boxUsed[grid.boxOf[cell]] &= bit
    const cage = cageOf[cell]
    if (cage !== NO_CAGE) {
      cageUsed[cage] &= bit
      cageRemaining[cage] += digit
      cageEmpty[cage]++
    }
  }

  function step({
    random,
    onSolution,
  }: {
    random: Random | null
    onSolution: () => boolean
  }): boolean {
    stepsLeft--
    if (stepsLeft < 0) {
      return true
    }
    let best = -1
    let bestMask = 0
    let bestCount = 10
    for (let cell = 0; cell < grid.cells; cell++) {
      if (values[cell] !== 0) {
        continue
      }
      const mask = candidates(cell)
      const count = bitCount(mask)
      if (count === 0) {
        return false
      }
      if (count < bestCount) {
        best = cell
        bestMask = mask
        bestCount = count
        if (count === 1) {
          break
        }
      }
    }
    if (best === -1) {
      return onSolution()
    }
    const digits =
      random === null
        ? digitsOf(bestMask)
        : shuffled({ items: digitsOf(bestMask), random })
    for (const digit of digits) {
      place({ cell: best, digit })
      const stop = step({ random, onSolution })
      unplace({ cell: best, digit })
      if (stop) {
        return true
      }
    }
    return false
  }

  let ok = true
  cages.forEach((cage, index) =>
    cage.cells.forEach((cell) => {
      if (cageOf[cell] !== NO_CAGE) {
        ok = false
      }
      cageOf[cell] = index
    }),
  )
  for (let cell = 0; cell < grid.cells; cell++) {
    const digit = givens[cell]
    if (digit === 0) {
      continue
    }
    if ((candidates(cell) & digitBit(digit)) === 0) {
      ok = false
    }
    place({ cell, digit })
  }
  const consistent =
    ok &&
    cages.every(
      (_, i) =>
        cageRemaining[i] >= 0 && (cageEmpty[i] > 0 || cageRemaining[i] === 0),
    )

  return {
    consistent,
    values,
    search({
      maxSteps,
      random,
      onSolution,
    }: {
      maxSteps: number
      random: Random | null
      onSolution: () => boolean
    }): boolean {
      stepsLeft = maxSteps
      step({ random, onSolution })
      return stepsLeft >= 0
    },
  }
}
