import type { KakuroGame, KakuroHint, Run } from '@/common/kakuro/kakuro.types'
import { bit, digitsOf, masksFor } from '@/common/kakuro/kakuroPuzzle.functions'

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
  const candidates = new Map(
    empty.map((cell) => [
      cell,
      (puzzle.runsOf.get(cell) ?? []).reduce(
        (mask, run) => mask & runCandidates({ game, run }),
        ALL_DIGITS,
      ),
    ]),
  )
  const single = empty.find(
    (cell) => digitsOf(candidates.get(cell) ?? 0).length === 1,
  )
  if (single !== undefined) {
    const digit = digitsOf(candidates.get(single) ?? 0)[0]
    return { cell: single, digit, message: `Only ${digit} fits here.` }
  }
  for (const run of puzzle.runs) {
    const open = run.cells.filter((cell) => values[cell] === 0)
    const needed = neededDigits({ game, run })
    for (const digit of digitsOf(needed)) {
      const places = open.filter(
        (cell) => ((candidates.get(cell) ?? 0) & bit(digit)) !== 0,
      )
      if (places.length === 1) {
        return {
          cell: places[0],
          digit,
          message: `${digit} must be in this run, and only fits here.`,
        }
      }
    }
  }
  if (empty.length === 0) {
    return null
  }
  return {
    cell: empty[0],
    digit: puzzle.solution[empty[0]],
    message: 'Try this cell next.',
  }
}

const ALL_DIGITS = Array.from({ length: 9 }, (_, i) => bit(i + 1)).reduce(
  (a, b) => a | b,
  0,
)

function fittingMasks({ game, run }: { game: KakuroGame; run: Run }) {
  const placed = placedMask({ game, run })
  return masksFor({ length: run.cells.length, sum: run.sum }).filter(
    (mask) => (mask & placed) === placed,
  )
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

function runCandidates({ game, run }: { game: KakuroGame; run: Run }) {
  return (
    fittingMasks({ game, run }).reduce((all, mask) => all | mask, 0) &
    ~placedMask({ game, run })
  )
}
