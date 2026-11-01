import {
  DIFFICULTY,
  DIFFICULTY_ORDER,
  EFFORT_PER_EXTRA_COMBINATION,
  NO_CAGE,
  TECHNIQUES,
} from '@/games/sudoku/engine/sudoku.constants'
import type { Cage, Difficulty } from '@/games/sudoku/engine/sudoku.types'
import {
  bitCount,
  digitBit,
  gridFor,
  singleDigit,
} from '@/games/sudoku/engine/sudokuPuzzle.functions'
import { cageCombos } from '@/games/sudoku/engine/sudokuSolver.functions'

export function grade({
  givens,
  cages = [],
  maxLevel = DIFFICULTY.EXPERT,
}: {
  givens: number[]
  cages?: Cage[]
  maxLevel?: Difficulty
}): {
  level: Difficulty | null
  hardest: string | null
  score: number
  solved: boolean
} {
  const grid = gridFor(givens.length)
  const houseTotal = Array.from({ length: grid.size }, (_, i) => i + 1).reduce(
    (a, b) => a + b,
    0,
  )
  const values = [...givens]
  const cand = Array.from({ length: grid.cells }, () => 0)
  const cageOf = Array.from({ length: grid.cells }, () => NO_CAGE)
  cages.forEach((cage, index) =>
    cage.cells.forEach((cell) => (cageOf[cell] = index)),
  )
  const seen = Array.from({ length: grid.cells }, (_, cell) => {
    const cage = cageOf[cell]
    return cage === NO_CAGE
      ? grid.peers[cell]
      : [...new Set([...grid.peers[cell], ...cages[cage].cells])].filter(
          (it) => it !== cell,
        )
  })
  const seenSets = seen.map((cells) => new Set(cells))
  let cageEffort = 0

  function eliminate({ cell, mask }: { cell: number; mask: number }): boolean {
    if ((cand[cell] & mask) === 0) {
      return false
    }
    cand[cell] &= ~mask
    return true
  }

  function eliminateFromSeen({ cell, digit }: { cell: number; digit: number }) {
    const clear = ~digitBit(digit)
    for (const other of seen[cell]) {
      cand[other] &= clear
    }
  }

  function place({ cell, digit }: { cell: number; digit: number }) {
    values[cell] = digit
    cand[cell] = 0
    eliminateFromSeen({ cell, digit })
  }

  function sees({ a, b }: { a: number; b: number }) {
    return a !== b && seenSets[a].has(b)
  }

  function nakedSingle(): boolean {
    for (let cell = 0; cell < grid.cells; cell++) {
      if (values[cell] === 0 && bitCount(cand[cell]) === 1) {
        place({ cell, digit: singleDigit(cand[cell]) })
        return true
      }
    }
    return false
  }

  function hiddenSingle(): boolean {
    for (const house of grid.houses) {
      for (let digit = 1; digit <= grid.size; digit++) {
        const bit = digitBit(digit)
        let only = -1
        let count = 0
        for (const cell of house) {
          if ((cand[cell] & bit) !== 0) {
            only = cell
            count++
          }
        }
        if (count === 1) {
          place({ cell: only, digit })
          return true
        }
      }
    }
    return false
  }

  function lockedCandidates(): boolean {
    let progress = false
    for (let digit = 1; digit <= grid.size; digit++) {
      const bit = digitBit(digit)
      for (const box of grid.boxes) {
        const cells = box.filter((cell) => (cand[cell] & bit) !== 0)
        if (cells.length === 0) {
          continue
        }
        if (cells.every((cell) => grid.rowOf[cell] === grid.rowOf[cells[0]])) {
          for (const cell of grid.rows[grid.rowOf[cells[0]]]) {
            if (!box.includes(cell)) {
              progress = eliminate({ cell, mask: bit }) || progress
            }
          }
        }
        if (cells.every((cell) => grid.colOf[cell] === grid.colOf[cells[0]])) {
          for (const cell of grid.cols[grid.colOf[cells[0]]]) {
            if (!box.includes(cell)) {
              progress = eliminate({ cell, mask: bit }) || progress
            }
          }
        }
        if (progress) {
          return true
        }
      }
      for (const line of [...grid.rows, ...grid.cols]) {
        const cells = line.filter((cell) => (cand[cell] & bit) !== 0)
        if (
          cells.length === 0 ||
          !cells.every((cell) => grid.boxOf[cell] === grid.boxOf[cells[0]])
        ) {
          continue
        }
        for (const cell of grid.boxes[grid.boxOf[cells[0]]]) {
          if (!line.includes(cell)) {
            progress = eliminate({ cell, mask: bit }) || progress
          }
        }
        if (progress) {
          return true
        }
      }
    }
    return false
  }

  function nakedSubset(size: number): boolean {
    for (const house of grid.houses) {
      const open = house.filter(
        (cell) =>
          values[cell] === 0 &&
          bitCount(cand[cell]) >= 2 &&
          bitCount(cand[cell]) <= size,
      )
      for (const subset of combinations({ items: open, size })) {
        const union = subset.reduce((acc, cell) => acc | cand[cell], 0)
        if (bitCount(union) !== size) {
          continue
        }
        let progress = false
        for (const cell of house) {
          if (values[cell] === 0 && !subset.includes(cell)) {
            progress = eliminate({ cell, mask: union }) || progress
          }
        }
        if (progress) {
          return true
        }
      }
    }
    return false
  }

  function hiddenSubset(size: number): boolean {
    for (const house of grid.houses) {
      const digits = Array.from({ length: grid.size }, (_, i) => i + 1).filter(
        (digit) => !house.some((cell) => values[cell] === digit),
      )
      for (const subset of combinations({ items: digits, size })) {
        const mask = subset.reduce((acc, digit) => acc | digitBit(digit), 0)
        const cells = house.filter((cell) => (cand[cell] & mask) !== 0)
        if (cells.length !== size) {
          continue
        }
        let progress = false
        for (const cell of cells) {
          progress =
            eliminate({ cell, mask: grid.allDigits & ~mask }) || progress
        }
        if (progress) {
          return true
        }
      }
    }
    return false
  }

  function fish(size: number): boolean {
    for (let digit = 1; digit <= grid.size; digit++) {
      const bit = digitBit(digit)
      for (const [base, cover] of [
        [grid.rows, grid.cols],
        [grid.cols, grid.rows],
      ]) {
        const positions = base.map((line) =>
          line.flatMap((cell, index) =>
            (cand[cell] & bit) !== 0 ? [index] : [],
          ),
        )
        const lines = base
          .map((_, index) => index)
          .filter(
            (index) =>
              positions[index].length >= 2 && positions[index].length <= size,
          )
        for (const subset of combinations({ items: lines, size })) {
          const covered = new Set(subset.flatMap((index) => positions[index]))
          if (covered.size !== size) {
            continue
          }
          let progress = false
          for (const coverIndex of covered) {
            cover[coverIndex].forEach((cell, baseIndex) => {
              if (!subset.includes(baseIndex)) {
                progress = eliminate({ cell, mask: bit }) || progress
              }
            })
          }
          if (progress) {
            return true
          }
        }
      }
    }
    return false
  }

  function xyWing(): boolean {
    const pairs = Array.from({ length: grid.cells }, (_, cell) => cell).filter(
      (cell) => values[cell] === 0 && bitCount(cand[cell]) === 2,
    )
    for (const pivot of pairs) {
      const wings = pairs.filter(
        (cell) =>
          sees({ a: pivot, b: cell }) &&
          bitCount(cand[cell] & cand[pivot]) === 1,
      )
      for (const [a, b] of combinations({ items: wings, size: 2 })) {
        const shared = cand[a] & cand[b]
        if (bitCount(shared) !== 1 || (shared & cand[pivot]) !== 0) {
          continue
        }
        if (((cand[a] | cand[b]) & cand[pivot]) !== cand[pivot]) {
          continue
        }
        let progress = false
        for (let cell = 0; cell < grid.cells; cell++) {
          if (
            cell !== a &&
            cell !== b &&
            sees({ a: cell, b: a }) &&
            sees({ a: cell, b })
          ) {
            progress = eliminate({ cell, mask: shared }) || progress
          }
        }
        if (progress) {
          return true
        }
      }
    }
    return false
  }

  function xyzWing(): boolean {
    for (let pivot = 0; pivot < grid.cells; pivot++) {
      if (values[pivot] !== 0 || bitCount(cand[pivot]) !== 3) {
        continue
      }
      const wings = Array.from(
        { length: grid.cells },
        (_, cell) => cell,
      ).filter(
        (cell) =>
          values[cell] === 0 &&
          bitCount(cand[cell]) === 2 &&
          (cand[cell] & cand[pivot]) === cand[cell] &&
          sees({ a: pivot, b: cell }),
      )
      for (const [a, b] of combinations({ items: wings, size: 2 })) {
        if ((cand[a] | cand[b]) !== cand[pivot]) {
          continue
        }
        const shared = cand[a] & cand[b]
        if (bitCount(shared) !== 1) {
          continue
        }
        let progress = false
        for (let cell = 0; cell < grid.cells; cell++) {
          if (
            cell !== pivot &&
            cell !== a &&
            cell !== b &&
            sees({ a: cell, b: pivot }) &&
            sees({ a: cell, b: a }) &&
            sees({ a: cell, b })
          ) {
            progress = eliminate({ cell, mask: shared }) || progress
          }
        }
        if (progress) {
          return true
        }
      }
    }
    return false
  }

  function restrictCage({
    cells,
    sum,
  }: {
    cells: number[]
    sum: number
  }): boolean {
    const open = cells.filter((cell) => values[cell] === 0)
    if (open.length === 0) {
      return false
    }
    const placed = cells.filter((cell) => values[cell] !== 0)
    const usedMask = placed.reduce(
      (acc, cell) => acc | digitBit(values[cell]),
      0,
    )
    const remaining = sum - placed.reduce((acc, cell) => acc + values[cell], 0)
    const possible = open.map(() => 0)
    function assign({
      index,
      available,
      chosen,
    }: {
      index: number
      available: number
      chosen: number[]
    }): boolean {
      if (index === open.length) {
        chosen.forEach((digit, i) => (possible[i] |= digitBit(digit)))
        return true
      }
      let found = false
      let mask = cand[open[index]] & available
      while (mask !== 0) {
        const bit = mask & -mask
        mask ^= bit
        chosen[index] = singleDigit(bit)
        found =
          assign({ index: index + 1, available: available ^ bit, chosen }) ||
          found
      }
      return found
    }
    const fitting = cageCombos({
      size: open.length,
      sum: remaining,
      allowedDigits: grid.allDigits,
    }).filter(
      (combo) =>
        (combo & usedMask) === 0 &&
        assign({ index: 0, available: combo, chosen: open.map(() => 0) }),
    ).length
    let progress = false
    open.forEach((cell, i) => {
      progress =
        eliminate({ cell, mask: grid.allDigits & ~possible[i] }) || progress
    })
    if (progress) {
      cageEffort += Math.max(fitting - 1, 0) * EFFORT_PER_EXTRA_COMBINATION
    }
    return progress
  }

  function ruleOf45(): boolean {
    for (const house of grid.houses) {
      const houseCells = new Set(house)
      const touching = cages.filter((cage) =>
        cage.cells.some((cell) => houseCells.has(cell)),
      )
      const inside = touching.filter((cage) =>
        cage.cells.every((cell) => houseCells.has(cell)),
      )
      const insideCells = new Set(inside.flatMap((cage) => cage.cells))
      const innies = house.filter((cell) => !insideCells.has(cell))
      if (
        innies.length >= 1 &&
        innies.length <= 3 &&
        restrictCage({
          cells: innies,
          sum: houseTotal - inside.reduce((acc, cage) => acc + cage.sum, 0),
        })
      ) {
        return true
      }
      const touchingCells = touching.flatMap((cage) => cage.cells)
      const outies = touchingCells.filter((cell) => !houseCells.has(cell))
      const distinct = outies.every((a) =>
        outies.every((b) => a === b || sees({ a, b })),
      )
      const coversHouse = house.every((cell) => touchingCells.includes(cell))
      if (outies.length >= 1 && outies.length <= 3 && distinct && coversHouse) {
        if (
          restrictCage({
            cells: outies,
            sum: touching.reduce((acc, cage) => acc + cage.sum, 0) - houseTotal,
          })
        ) {
          return true
        }
      }
    }
    return false
  }

  const APPLY: Record<string, () => boolean> = {
    nakedSingle,
    hiddenSingle,
    cageCombination: () =>
      cages.some((cage) => restrictCage({ cells: cage.cells, sum: cage.sum })),
    lockedCandidates,
    nakedPair: () => nakedSubset(2),
    hiddenPair: () => hiddenSubset(2),
    ruleOf45,
    nakedTriple: () => nakedSubset(3),
    hiddenTriple: () => hiddenSubset(3),
    xWing: () => fish(2),
    xyWing,
    nakedQuad: () => nakedSubset(4),
    swordfish: () => fish(3),
    xyzWing,
  }

  for (let cell = 0; cell < grid.cells; cell++) {
    cand[cell] = values[cell] !== 0 ? 0 : grid.allDigits
  }
  for (let cell = 0; cell < grid.cells; cell++) {
    if (values[cell] !== 0) {
      eliminateFromSeen({ cell, digit: values[cell] })
    }
  }
  const maxRank = DIFFICULTY_ORDER.indexOf(maxLevel)
  const techniques = TECHNIQUES.filter(
    (it) =>
      DIFFICULTY_ORDER.indexOf(it.level) <= maxRank &&
      (cages.length > 0 || !it.killerOnly),
  )
  let hardest: (typeof TECHNIQUES)[number] | null = null
  let score = 0
  while (values.some((value) => value === 0)) {
    if (values.some((value, cell) => value === 0 && cand[cell] === 0)) {
      break
    }
    cageEffort = 0
    const used = techniques.find((it) => APPLY[it.name]())
    if (used === undefined) {
      break
    }
    if (
      hardest === null ||
      TECHNIQUES.indexOf(used) > TECHNIQUES.indexOf(hardest)
    ) {
      hardest = used
    }
    score += used.weight + cageEffort
  }
  const valid =
    grid.houses.every(
      (house) =>
        house.reduce((acc, cell) => acc | digitBit(values[cell]), 0) ===
        grid.allDigits,
    ) &&
    cages.every(
      (cage) =>
        cage.cells.reduce((acc, cell) => acc + values[cell], 0) === cage.sum,
    )
  const solved = values.every((value) => value !== 0) && valid
  return {
    level: solved ? (hardest?.level ?? DIFFICULTY.EASY) : null,
    hardest: hardest?.name ?? null,
    score,
    solved,
  }
}

function combinations<T>({ items, size }: { items: T[]; size: number }): T[][] {
  if (size === 0) {
    return [[]]
  }
  const result: T[][] = []
  for (let i = 0; i <= items.length - size; i++) {
    for (const rest of combinations({
      items: items.slice(i + 1),
      size: size - 1,
    })) {
      result.push([items[i], ...rest])
    }
  }
  return result
}
