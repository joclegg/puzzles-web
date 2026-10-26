import {
  HINT_KIND,
  NEXT_TILE,
  REASON_MESSAGE,
  TILE,
} from '@/common/twoTone/twoTone.constants'
import type {
  Change,
  Hint,
  Puzzle,
  Tile,
  TwoToneGame,
} from '@/common/twoTone/twoTone.types'
import {
  brokenCells,
  cellsOf,
  tileAt,
  withTile,
} from '@/common/twoTone/twoToneGrid.functions'
import { nextDeduction } from '@/common/twoTone/twoToneSolver.functions'

export function decodeChanges(text: string): Change[] {
  return text
    .split(',')
    .filter((it) => it.length > 0)
    .map((it) => ({
      cell: Number(it.slice(0, -2)),
      from: it.at(-2) as Tile,
      to: it.at(-1) as Tile,
    }))
}

export function encodeChanges(changes: Change[]): string {
  return changes.map((it) => `${it.cell}${it.from}${it.to}`).join(',')
}

export function gameBrokenCells(game: TwoToneGame): Set<number> {
  return brokenCells(game.grid)
}

export function hintMessage(hint: Hint): string {
  if (hint.kind === HINT_KIND.MISTAKE) {
    return hint.cells.length === 1
      ? 'This tile is the wrong colour.'
      : `These ${hint.cells.length} tiles are the wrong colour.`
  }
  const deduction = hint.deduction!
  return REASON_MESSAGE[deduction.reason](
    deduction.line.isRow ? 'row' : 'column',
  )
}

export function hintTargets(hint: Hint | null): Set<number> {
  if (hint === null) {
    return new Set()
  }
  return new Set(
    hint.kind === HINT_KIND.NEXT ? hint.deduction!.cells : hint.cells,
  )
}

export function isGiven({ puzzle, cell }: { puzzle: Puzzle; cell: number }) {
  return tileAt({ grid: puzzle.givens, cell }) !== TILE.EMPTY
}

export function isSolved(game: TwoToneGame): boolean {
  return game.grid.tiles === game.puzzle.solution.tiles
}

export function newGame(puzzle: Puzzle): TwoToneGame {
  return { puzzle, grid: puzzle.givens, changes: [], hint: null }
}

export function paint({
  game,
  cell,
  colour,
}: {
  game: TwoToneGame
  cell: number
  colour: Tile
}): TwoToneGame {
  return setTile({
    game,
    cell,
    change: (current) => (current === colour ? TILE.EMPTY : colour),
  })
}

export function progressPercent(game: TwoToneGame): number {
  const tiles = [...game.puzzle.givens.tiles]
  const open = tiles.filter((tile) => tile === TILE.EMPTY).length
  const filled = tiles.filter(
    (given, cell) =>
      given === TILE.EMPTY && game.grid.tiles[cell] !== TILE.EMPTY,
  ).length
  return open === 0 ? 100 : Math.floor((filled * 100) / open)
}

export function replay({
  puzzle,
  changes,
}: {
  puzzle: Puzzle
  changes: Change[]
}): TwoToneGame {
  const grid = changes.reduce(
    (current, change) =>
      withTile({ grid: current, cell: change.cell, tile: change.to }),
    puzzle.givens,
  )
  return { puzzle, grid, changes, hint: null }
}

export function tap({ game, cell }: { game: TwoToneGame; cell: number }) {
  return setTile({ game, cell, change: (current) => NEXT_TILE[current] })
}

export function undo(game: TwoToneGame): TwoToneGame {
  const last = game.changes.at(-1)
  if (isSolved(game) || last === undefined) {
    return { ...game, hint: null }
  }
  return {
    ...game,
    grid: withTile({ grid: game.grid, cell: last.cell, tile: last.from }),
    changes: game.changes.slice(0, -1),
    hint: null,
  }
}

export function withHint(game: TwoToneGame): TwoToneGame {
  if (isSolved(game)) {
    return game
  }
  const mistakes = [...game.grid.tiles].flatMap((tile, cell) =>
    tile !== TILE.EMPTY && tile !== game.puzzle.solution.tiles[cell]
      ? [cell]
      : [],
  )
  if (mistakes.length > 0) {
    return {
      ...game,
      hint: { kind: HINT_KIND.MISTAKE, cells: mistakes, deduction: null },
    }
  }
  const deduction = nextDeduction(game.grid)
  if (deduction === null) {
    return { ...game, hint: null }
  }
  return {
    ...game,
    hint: {
      kind: HINT_KIND.NEXT,
      cells: cellsOf({ grid: game.grid, line: deduction.line }),
      deduction,
    },
  }
}

function setTile({
  game,
  cell,
  change,
}: {
  game: TwoToneGame
  cell: number
  change: (current: Tile) => Tile
}): TwoToneGame {
  if (isSolved(game) || isGiven({ puzzle: game.puzzle, cell })) {
    return { ...game, hint: null }
  }
  const from = tileAt({ grid: game.grid, cell })
  const to = change(from)
  if (to === from) {
    return { ...game, hint: null }
  }
  return {
    ...game,
    grid: withTile({ grid: game.grid, cell, tile: to }),
    changes: [...game.changes, { cell, from, to }],
    hint: null,
  }
}
