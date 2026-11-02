import type {
  KakuroGame,
  KakuroHint,
  Run,
} from '@/games/kakuro/engine/kakuro.types'
import {
  bit,
  digitsOf,
  masksFor,
} from '@/games/kakuro/engine/kakuroPuzzle.functions'

const ALL_DIGITS = Array.from({ length: 9 }, (_, i) => bit(i + 1)).reduce(
  (a, b) => a | b,
  0,
)

export function findHint(game: KakuroGame): KakuroHint | null {
  const { puzzle, values } = game
  const wrong = values.findIndex(
    (value, cell) => value !== 0 && value !== puzzle.solution[cell],
  )
  if (wrong !== -1) {
    return {
      cell: wrong,
      digit: puzzle.solution[wrong],
      message: 'This cell is wrong.',
    }
  }
  const empty = [...puzzle.runsOf.keys()]
    .filter((cell) => values[cell] === 0)
    .sort((a, b) => a - b)
  if (empty.length === 0) {
    return null
  }
  const candidates = narrowedCandidates({ game, empty })
  const single = empty.find(
    (cell) => digitsOf(candidates.get(cell) ?? 0).length === 1,
  )
  if (single !== undefined) {
    const digit = digitsOf(candidates.get(single) ?? 0)[0]
    return {
      cell: single,
      digit,
      message: `Only ${digit} fits here: ${runNames({ game, cell: single })} leave no other digit.`,
    }
  }
  for (const run of puzzle.runs) {
    const open = run.cells.filter((cell) => values[cell] === 0)
    for (const digit of digitsOf(neededDigits({ game, run }))) {
      const places = open.filter(
        (cell) => ((candidates.get(cell) ?? 0) & bit(digit)) !== 0,
      )
      if (places.length === 1) {
        return {
          cell: places[0],
          digit,
          message: `Every way to make ${runName(run)} uses a ${digit}, and this is the only cell in it where ${digit} fits.`,
        }
      }
    }
  }
  const allowed = new Map(
    empty.map((cell) => [cell, runAllowed({ game, cell })]),
  )
  const cell = empty.reduce((best, each) =>
    digitsOf(allowed.get(each) ?? 0).length <
    digitsOf(allowed.get(best) ?? 0).length
      ? each
      : best,
  )
  const runs = (puzzle.runsOf.get(cell) ?? [])
    .map(
      (run) =>
        `${run.isAcross ? 'across' : 'down'} run (${run.sum} in ${run.cells.length})`,
    )
    .join(' and ')
  return {
    cell,
    digit: puzzle.solution[cell],
    message: `This cell's ${runs} only allow ${listDigits(digitsOf(allowed.get(cell) ?? 0))}.`,
  }
}

function assignable({
  cells,
  candidates,
  remaining,
  onFound,
  chosen = [],
}: {
  cells: number[]
  candidates: Map<number, number>
  remaining: number
  onFound: (digits: number[]) => void
  chosen?: number[]
}) {
  if (chosen.length === cells.length) {
    onFound(chosen)
    return
  }
  const cell = cells[chosen.length]
  for (const digit of digitsOf((candidates.get(cell) ?? 0) & remaining)) {
    assignable({
      cells,
      candidates,
      remaining: remaining & ~bit(digit),
      onFound,
      chosen: [...chosen, digit],
    })
  }
}

function fittingMasks({ game, run }: { game: KakuroGame; run: Run }) {
  const placed = placedMask({ game, run })
  return masksFor({ length: run.cells.length, sum: run.sum }).filter(
    (mask) => (mask & placed) === placed,
  )
}

function listDigits(digits: number[]): string {
  return digits.length <= 1
    ? digits.join('')
    : `${digits.slice(0, -1).join(', ')} or ${digits[digits.length - 1]}`
}

function narrowedCandidates({
  game,
  empty,
}: {
  game: KakuroGame
  empty: number[]
}): Map<number, number> {
  const candidates = new Map(empty.map((cell) => [cell, ALL_DIGITS]))
  for (let changed = true; changed;) {
    changed = false
    for (const run of game.puzzle.runs) {
      const open = run.cells.filter((cell) => game.values[cell] === 0)
      if (open.length === 0) continue
      const supported = new Map(open.map((cell) => [cell, 0]))
      const placed = placedMask({ game, run })
      for (const mask of fittingMasks({ game, run })) {
        assignable({
          cells: open,
          candidates,
          remaining: mask & ~placed,
          onFound: (digits) =>
            digits.forEach((digit, i) =>
              supported.set(
                open[i],
                (supported.get(open[i]) ?? 0) | bit(digit),
              ),
            ),
        })
      }
      for (const cell of open) {
        const next = (candidates.get(cell) ?? 0) & (supported.get(cell) ?? 0)
        if (next !== candidates.get(cell)) {
          candidates.set(cell, next)
          changed = true
        }
      }
    }
  }
  return candidates
}

function neededDigits({ game, run }: { game: KakuroGame; run: Run }) {
  const masks = fittingMasks({ game, run })
  const inEvery = masks.reduce((all, mask) => all & mask, ALL_DIGITS)
  return masks.length === 0 ? 0 : inEvery & ~placedMask({ game, run })
}

function placedMask({ game, run }: { game: KakuroGame; run: Run }) {
  return run.cells
    .filter((cell) => game.values[cell] !== 0)
    .reduce((mask, cell) => mask | bit(game.values[cell]), 0)
}

function runAllowed({ game, cell }: { game: KakuroGame; cell: number }) {
  return (game.puzzle.runsOf.get(cell) ?? []).reduce(
    (mask, run) =>
      mask &
      fittingMasks({ game, run }).reduce((all, each) => all | each, 0) &
      ~placedMask({ game, run }),
    ALL_DIGITS,
  )
}

function runName(run: Run) {
  return `${run.sum} in ${run.cells.length} ${run.isAcross ? 'across' : 'down'}`
}

function runNames({ game, cell }: { game: KakuroGame; cell: number }) {
  return (game.puzzle.runsOf.get(cell) ?? [])
    .map((run) => runName(run))
    .join(' and ')
}
