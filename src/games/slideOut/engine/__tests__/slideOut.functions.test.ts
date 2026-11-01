import { describe, expect, it } from 'vitest'

import {
  boardOf,
  isSolved,
  newGame,
  revealSolution,
  slide,
  undo,
  withHint,
} from '@/games/slideOut/engine/slideOut.functions'
import {
  decodeMoves,
  decodePuzzle,
  encodeMoves,
  slideRange,
} from '@/games/slideOut/engine/slideOutBoard.functions'

const PUZZLE = decodePuzzle('3;202H,023V,033V')

describe('slideRange', () => {
  it('stops at the edge and at other blocks', () => {
    expect(slideRange({ blocks: PUZZLE.blocks, index: 1 })).toEqual({
      low: 0,
      high: 3,
    })
  })
})

describe('slide', () => {
  it('slides a block within its range', () => {
    const after = slide({
      game: newGame({ puzzle: PUZZLE }),
      block: 1,
      position: 3,
    })

    expect(boardOf(after)[1].row).toBe(3)
  })

  it('ignores a slide past another block', () => {
    const after = slide({
      game: newGame({ puzzle: PUZZLE }),
      block: 0,
      position: 4,
    })

    expect(after.moves).toEqual([])
  })

  it('merges repeated slides of one block into one move', () => {
    const game = slide({
      game: newGame({ puzzle: PUZZLE }),
      block: 1,
      position: 3,
    })

    const after = slide({ game, block: 1, position: 2 })

    expect(after.moves).toEqual([{ block: 1, position: 2 }])
  })

  it('drops a move that puts the block back where it was', () => {
    const game = slide({
      game: newGame({ puzzle: PUZZLE }),
      block: 1,
      position: 3,
    })

    const after = slide({ game, block: 1, position: 0 })

    expect(after.moves).toEqual([])
  })

  it('frees the red block in par', () => {
    const moves = [
      { block: 1, position: 3 },
      { block: 2, position: 3 },
      { block: 0, position: 4 },
    ]

    const after = moves.reduce(
      (game, move) => slide({ game, ...move }),
      newGame({ puzzle: PUZZLE }),
    )

    expect([isSolved(after), after.moves.length]).toEqual([true, 3])
  })
})

describe('undo', () => {
  it('takes back the last move', () => {
    const game = slide({
      game: newGame({ puzzle: PUZZLE }),
      block: 1,
      position: 3,
    })

    expect(undo(game).moves).toEqual([])
  })
})

describe('withHint', () => {
  it('suggests the first move of a shortest solution', () => {
    expect(withHint(newGame({ puzzle: PUZZLE })).hint).toEqual({
      block: 1,
      position: 3,
    })
  })
})

describe('encodeMoves', () => {
  it('round-trips moves', () => {
    const moves = [
      { block: 1, position: 3 },
      { block: 0, position: 4 },
    ]

    expect(decodeMoves(encodeMoves(moves))).toEqual(moves)
  })
})

describe('revealSolution', () => {
  it('plays the shortest path to the end', () => {
    const game = newGame({ puzzle: PUZZLE })

    expect(isSolved(revealSolution(game))).toBe(true)
  })
})
