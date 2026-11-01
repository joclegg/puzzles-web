import { describe, expect, it } from 'vitest'

import {
  COMBINATION_ORDER,
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/kakuro/kakuro.constants'
import {
  brokenRuns,
  combinationLines,
  decodeChanges,
  encodeChanges,
  erase,
  isSolved,
  newGame,
  replay,
  tapCell,
  tapDigit,
  toggleNotes,
  undo,
} from '@/common/kakuro/kakuro.functions'
import type { KakuroGame } from '@/common/kakuro/kakuro.types'
import { createPuzzle, digitsOf } from '@/common/kakuro/kakuroPuzzle.functions'

const SMALL = createPuzzle({ size: 3, solution: [0, 0, 0, 0, 1, 2, 0, 3, 4] })

function enter({
  game,
  moves,
}: {
  game: KakuroGame
  moves: [number, number][]
}) {
  return moves.reduce(
    (state, [cell, digit]) =>
      tapDigit({ game: tapCell({ game: state, cell }), digit }),
    game,
  )
}

describe('tapDigit', () => {
  it('places a digit and clears it on a second tap', () => {
    const game = tapCell({ game: newGame({ puzzle: SMALL }), cell: 4 })

    const placed = tapDigit({ game, digit: 1 })
    const cleared = tapDigit({ game: placed, digit: 1 })

    expect([placed.values[4], cleared.values[4]]).toEqual([1, 0])
  })

  it('toggles notes in notes mode', () => {
    const game = [1, 2, 1].reduce(
      (state, digit) => tapDigit({ game: state, digit }),
      toggleNotes(tapCell({ game: newGame({ puzzle: SMALL }), cell: 4 })),
    )

    expect([game.values[4], digitsOf(game.notes[4])]).toEqual([0, [2]])
  })

  it('keeps a filled cell when a note is tapped on it', () => {
    const filled = enter({ game: newGame({ puzzle: SMALL }), moves: [[4, 1]] })

    const game = tapDigit({ game: toggleNotes(filled), digit: 2 })

    expect([game.values[4], game.notes[4]]).toEqual([1, 0])
  })

  it('leaves a starting digit alone', () => {
    const puzzle = createPuzzle({ ...SMALL, givens: new Set([4]) })

    const game = enter({ game: newGame({ puzzle }), moves: [[4, 9]] })

    expect(game.values[4]).toBe(1)
  })

  it('refuses and counts a clash when clashes are blocked', () => {
    const game = enter({
      game: newGame({
        puzzle: SMALL,
        mistakeCheck: MISTAKE_CHECK.BLOCK_CLASHES,
      }),
      moves: [[5, 2]],
    })

    const after = enter({ game, moves: [[4, 2]] })

    expect([after.values[4], after.rejected, after.mistakes]).toEqual([0, 4, 1])
  })
})

describe('undo', () => {
  it.each([1, 3])('takes back %i entries to the start', (entries) => {
    const played = Array.from({ length: entries }, (_, i) => i + 1).reduce(
      (state, digit) => tapDigit({ game: state, digit }),
      tapCell({ game: newGame({ puzzle: SMALL }), cell: 5 }),
    )

    const undone = Array.from({ length: entries }).reduce<KakuroGame>(
      (state) => undo(state),
      played,
    )

    expect(undone.values).toEqual(Array(9).fill(0))
  })
})

describe('brokenRuns', () => {
  it('lists a run with a repeated digit', () => {
    const game = enter({
      game: newGame({ puzzle: SMALL }),
      moves: [
        [4, 2],
        [5, 2],
      ],
    })

    expect(brokenRuns(game).filter((run) => run.isAcross)).toEqual([
      { cells: [4, 5], sum: 3, isAcross: true, clueCell: 3 },
    ])
  })
})

describe('isSolved', () => {
  it('is solved when every cell is right', () => {
    const game = enter({
      game: newGame({ puzzle: SMALL }),
      moves: [
        [4, 1],
        [5, 2],
        [7, 3],
        [8, 4],
      ],
    })

    expect(isSolved(game)).toBe(true)
  })
})

describe('replay', () => {
  it('rebuilds values and notes from saved changes', () => {
    const played = tapDigit({
      game: tapCell({
        game: toggleNotes(
          enter({ game: newGame({ puzzle: SMALL }), moves: [[4, 1]] }),
        ),
        cell: 5,
      }),
      digit: 2,
    })

    const replayed = replay({
      game: newGame({ puzzle: SMALL }),
      changes: decodeChanges(encodeChanges(played.changes)),
    })

    expect([replayed.values, replayed.notes]).toEqual([
      played.values,
      played.notes,
    ])
  })
})

describe('combinationLines', () => {
  it('lists the digit sets that still fit each run', () => {
    const game = tapCell({
      game: enter({ game: newGame({ puzzle: SMALL }), moves: [[5, 2]] }),
      cell: 4,
    })

    expect(combinationLines({ game })).toEqual([
      {
        label: 'Across 3 in 2',
        options: [
          [
            { digit: 1, placed: false },
            { digit: 2, placed: true },
          ],
        ],
      },
      {
        label: 'Down 4 in 2',
        options: [
          [
            { digit: 1, placed: false },
            { digit: 3, placed: false },
          ],
        ],
      },
    ])
  })

  it.each([
    [
      COMBINATION_ORDER.INCREASING,
      [
        [1, 5],
        [2, 4],
      ],
    ],
    [
      COMBINATION_ORDER.DECREASING,
      [
        [5, 1],
        [4, 2],
      ],
    ],
  ])('lists the combinations in %s order', (order, expected) => {
    const puzzle = createPuzzle({
      size: 3,
      solution: [0, 0, 0, 0, 1, 5, 0, 3, 4],
    })
    const game = tapCell({ game: newGame({ puzzle }), cell: 4 })

    const across = combinationLines({ game, order })[0]

    expect(
      across.options.map((option) => option.map((it) => it.digit)),
    ).toEqual(expected)
  })
})

describe('number first', () => {
  it('places the picked digit in tapped cells and clears it on a second tap', () => {
    const game = tapDigit({
      game: newGame({ puzzle: SMALL, inputMode: INPUT_MODE.DIGIT_FIRST }),
      digit: 1,
    })

    const placed = tapCell({ game, cell: 4 })
    const cleared = tapCell({ game: placed, cell: 4 })

    expect([placed.values[4], cleared.values[4]]).toEqual([1, 0])
  })

  it('clears a filled cell with erase on', () => {
    const game = erase(
      tapCell({
        game: tapDigit({
          game: newGame({ puzzle: SMALL, inputMode: INPUT_MODE.DIGIT_FIRST }),
          digit: 2,
        }),
        cell: 5,
      }),
    )

    expect(tapCell({ game, cell: 5 }).values[5]).toBe(0)
  })
})
