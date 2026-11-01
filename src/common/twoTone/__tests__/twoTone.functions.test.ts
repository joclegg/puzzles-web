import { describe, expect, it } from 'vitest'

import { HINT_KIND, TILE } from '@/common/twoTone/twoTone.constants'
import {
  decodeChanges,
  encodeChanges,
  isSolved,
  newGame,
  progressPercent,
  replay,
  tap,
  undo,
  withHint,
} from '@/common/twoTone/twoTone.functions'
import type { TwoToneGame } from '@/common/twoTone/twoTone.types'
import { parseGrid, withTile } from '@/common/twoTone/twoToneGrid.functions'

const SOLUTION = parseGrid({ size: 4, text: 'RBBR BRRB RBRB BRBR' })

const PUZZLE = {
  givens: parseGrid({ size: 4, text: 'R... .... .... ....' }),
  solution: SOLUTION,
}

function tapAll({ game, cells }: { game: TwoToneGame; cells: number[] }) {
  return cells.reduce((state, cell) => tap({ game: state, cell }), game)
}

describe('tap', () => {
  it('cycles an empty tile through red, blue and empty', () => {
    const states = [1, 2, 3].reduce(
      (all) => [...all, tap({ game: all.at(-1)!, cell: 1 })],
      [newGame(PUZZLE)],
    )

    expect(states.map((state) => state.grid.tiles[1])).toEqual([
      TILE.EMPTY,
      TILE.RED,
      TILE.BLUE,
      TILE.EMPTY,
    ])
  })

  it('leaves a starting tile alone', () => {
    expect(tap({ game: newGame(PUZZLE), cell: 0 }).grid.tiles[0]).toBe(TILE.RED)
  })

  it('solves the puzzle when the last tile is filled correctly', () => {
    const game = {
      ...newGame(PUZZLE),
      grid: withTile({ grid: SOLUTION, cell: 1, tile: TILE.EMPTY }),
    }

    const after = tapAll({ game, cells: [1, 1] })

    expect([isSolved(after), progressPercent(after)]).toEqual([true, 100])
  })
})

describe('undo', () => {
  it.each([1, 4, 9])('takes back %i taps to the start', (taps) => {
    const cells = Array.from({ length: taps }, (_, i) => ((i + 1) % 15) + 1)
    const played = tapAll({ game: newGame(PUZZLE), cells })

    const undone = cells.reduce((state) => undo(state), played)

    expect(undone.grid).toEqual(PUZZLE.givens)
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
  it('points out a wrong tile', () => {
    const game = tap({ game: newGame(PUZZLE), cell: 1 })

    expect(withHint(game).hint).toEqual({
      kind: HINT_KIND.MISTAKE,
      cells: [1],
      deduction: null,
    })
  })

  it('gives the next deduction when there are no mistakes', () => {
    const game = newGame({
      givens: parseGrid({ size: 4, text: 'RR.. .... .... ....' }),
      solution: parseGrid({ size: 4, text: 'RRBB BBRR RBRB BRBR' }),
    })

    const hint = withHint(game).hint

    expect([hint?.kind, hint?.deduction?.cells]).toEqual([HINT_KIND.NEXT, [2]])
  })
})
