import { describe, expect, it } from 'vitest'

import { DOT, HINT_KIND } from '@/games/sightlines/engine/sightlines.constants'
import {
  decodeChanges,
  encodeChanges,
  isSolved,
  newGame,
  paint,
  replay,
  tap,
  undo,
  withHint,
} from '@/games/sightlines/engine/sightlines.functions'
import type { SightlinesGame } from '@/games/sightlines/engine/sightlines.types'
import {
  parseGrid,
  withDot,
} from '@/games/sightlines/engine/sightlinesGrid.functions'
import { brokenCells } from '@/games/sightlines/engine/sightlinesPuzzle.functions'

const SOLUTION = parseGrid({ size: 4, text: 'BBRB BRBB RBBR BBRB' })

const PUZZLE = {
  solution: SOLUTION,
  numbers: new Map([[0, 2]]),
  walls: new Set([2]),
}

function tapAll({ game, cells }: { game: SightlinesGame; cells: number[] }) {
  return cells.reduce((state, cell) => tap({ game: state, cell }), game)
}

describe('tap', () => {
  it('cycles an empty dot through blue, red and empty', () => {
    const states = [1, 2, 3].reduce(
      (all) => [...all, tap({ game: all.at(-1)!, cell: 1 })],
      [newGame(PUZZLE)],
    )

    expect(states.map((state) => state.grid.dots[1])).toEqual([
      DOT.EMPTY,
      DOT.BLUE,
      DOT.RED,
      DOT.EMPTY,
    ])
  })

  it.each([0, 2])('leaves starting dot %i alone', (cell) => {
    const after = tap({ game: newGame(PUZZLE), cell })

    expect(after.grid).toEqual(newGame(PUZZLE).grid)
  })

  it('solves the puzzle when the last dot is set right', () => {
    const game = {
      ...newGame(PUZZLE),
      grid: withDot({ grid: SOLUTION, cell: 1, dot: DOT.EMPTY }),
    }

    expect(isSolved(tap({ game, cell: 1 }))).toBe(true)
  })
})

describe('replay', () => {
  it('rebuilds the grid from saved changes', () => {
    const played = tapAll({ game: newGame(PUZZLE), cells: [1, 1, 5] })

    const replayed = replay({
      puzzle: PUZZLE,
      changes: decodeChanges(encodeChanges(played.changes)),
    })

    expect(replayed.grid).toEqual(played.grid)
  })
})

describe('withHint', () => {
  it('points out a wrong dot', () => {
    const game = tapAll({ game: newGame(PUZZLE), cells: [1, 1] })

    expect(withHint(game).hint).toEqual({
      kind: HINT_KIND.MISTAKE,
      cells: [1],
      deduction: null,
    })
  })

  it("gives the next step with the number's lines of sight", () => {
    const hint = withHint(newGame(PUZZLE)).hint

    expect(hint?.deduction?.source).toBe(0)
    expect(hint?.cells).toEqual(expect.arrayContaining([0, 12]))
  })
})

describe('brokenCells', () => {
  it('lists a number boxed in by red dots', () => {
    const game = tapAll({ game: newGame(PUZZLE), cells: [1, 1, 4, 4] })

    expect(brokenCells({ puzzle: PUZZLE, grid: game.grid }).has(0)).toBe(true)
  })
})

describe('paint', () => {
  it.each([DOT.RED, DOT.BLUE])(
    'paints an empty spot %s and clears it on a second tap',
    (colour) => {
      const painted = paint({ game: newGame(PUZZLE), cell: 1, colour })
      const cleared = paint({ game: painted, cell: 1, colour })

      expect([painted.grid.dots[1], cleared.grid.dots[1]]).toEqual([
        colour,
        DOT.EMPTY,
      ])
    },
  )

  it('switches colour in one undoable change', () => {
    const game = paint({ game: newGame(PUZZLE), cell: 1, colour: DOT.RED })

    const after = paint({ game, cell: 1, colour: DOT.BLUE })

    expect([after.grid.dots[1], undo(after).grid.dots[1]]).toEqual([
      DOT.BLUE,
      DOT.RED,
    ])
  })
})
