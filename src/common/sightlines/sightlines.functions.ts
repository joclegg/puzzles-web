import {
  DIRECTIONS,
  DOT,
  HINT_KIND,
  NEXT_DOT,
  REASON_MESSAGE,
} from '@/common/sightlines/sightlines.constants'
import type {
  Change,
  Dot,
  Hint,
  Puzzle,
  SightlinesGame,
} from '@/common/sightlines/sightlines.types'
import {
  dotAt,
  ray,
  withDot,
} from '@/common/sightlines/sightlinesGrid.functions'
import {
  givensOf,
  isGiven,
} from '@/common/sightlines/sightlinesPuzzle.functions'
import { nextDeduction } from '@/common/sightlines/sightlinesSolver.functions'

export function decodeChanges(text: string): Change[] {
  return text
    .split(',')
    .filter((it) => it.length > 0)
    .map((it) => ({
      cell: Number(it.slice(0, -2)),
      from: it.at(-2) as Dot,
      to: it.at(-1) as Dot,
    }))
}

export function encodeChanges(changes: Change[]): string {
  return changes.map((it) => `${it.cell}${it.from}${it.to}`).join(',')
}

export function hintMessage(hint: Hint): string {
  if (hint.kind === HINT_KIND.MISTAKE) {
    return hint.cells.length === 1
      ? 'This dot is the wrong colour.'
      : `These ${hint.cells.length} dots are the wrong colour.`
  }
  return REASON_MESSAGE[hint.deduction!.reason]
}

export function hintTargets(hint: Hint | null): Set<number> {
  if (hint === null) {
    return new Set()
  }
  return new Set(
    hint.kind === HINT_KIND.NEXT ? hint.deduction!.cells : hint.cells,
  )
}

export function isSolved(game: SightlinesGame): boolean {
  return game.grid.dots === game.puzzle.solution.dots
}

export function newGame(puzzle: Puzzle): SightlinesGame {
  return { puzzle, grid: givensOf(puzzle), changes: [], hint: null }
}

export function paint({
  game,
  cell,
  colour,
}: {
  game: SightlinesGame
  cell: number
  colour: Dot
}): SightlinesGame {
  return setDot({
    game,
    cell,
    change: (current) => (current === colour ? DOT.EMPTY : colour),
  })
}

export function progressPercent(game: SightlinesGame): number {
  const cells = [...game.grid.dots].map((_, cell) => cell)
  const open = cells.filter((cell) => !isGiven({ puzzle: game.puzzle, cell }))
  const filled = open.filter(
    (cell) => dotAt({ grid: game.grid, cell }) !== DOT.EMPTY,
  )
  return open.length === 0
    ? 100
    : Math.floor((filled.length * 100) / open.length)
}

export function replay({
  puzzle,
  changes,
}: {
  puzzle: Puzzle
  changes: Change[]
}): SightlinesGame {
  const grid = changes.reduce(
    (current, change) =>
      withDot({ grid: current, cell: change.cell, dot: change.to }),
    givensOf(puzzle),
  )
  return { puzzle, grid, changes, hint: null }
}

export function tap({ game, cell }: { game: SightlinesGame; cell: number }) {
  return setDot({ game, cell, change: (current) => NEXT_DOT[current] })
}

export function undo(game: SightlinesGame): SightlinesGame {
  const last = game.changes.at(-1)
  if (isSolved(game) || last === undefined) {
    return { ...game, hint: null }
  }
  return {
    ...game,
    grid: withDot({ grid: game.grid, cell: last.cell, dot: last.from }),
    changes: game.changes.slice(0, -1),
    hint: null,
  }
}

export function withHint(game: SightlinesGame): SightlinesGame {
  if (isSolved(game)) {
    return game
  }
  const mistakes = [...game.grid.dots].flatMap((dot, cell) =>
    dot !== DOT.EMPTY && dot !== game.puzzle.solution.dots[cell] ? [cell] : [],
  )
  if (mistakes.length > 0) {
    return {
      ...game,
      hint: { kind: HINT_KIND.MISTAKE, cells: mistakes, deduction: null },
    }
  }
  const deduction = nextDeduction({
    grid: game.grid,
    numbers: game.puzzle.numbers,
  })
  if (deduction === null) {
    return { ...game, hint: null }
  }
  const sight = [
    ...DIRECTIONS.flatMap((direction) =>
      ray({ grid: game.grid, cell: deduction.source, direction }),
    ),
    deduction.source,
  ]
  return {
    ...game,
    hint: { kind: HINT_KIND.NEXT, cells: sight, deduction },
  }
}

function setDot({
  game,
  cell,
  change,
}: {
  game: SightlinesGame
  cell: number
  change: (current: Dot) => Dot
}): SightlinesGame {
  if (isSolved(game) || isGiven({ puzzle: game.puzzle, cell })) {
    return { ...game, hint: null }
  }
  const from = dotAt({ grid: game.grid, cell })
  const to = change(from)
  if (to === from) {
    return { ...game, hint: null }
  }
  return {
    ...game,
    grid: withDot({ grid: game.grid, cell, dot: to }),
    changes: [...game.changes, { cell, from, to }],
    hint: null,
  }
}
