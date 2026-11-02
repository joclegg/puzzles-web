import { describe, expect, it } from 'vitest'

import { GUESS } from '@/games/wordWheel/engine/wordWheel.constants'
import {
  fits,
  isSolved,
  newGame,
  reveal,
  shuffleWheel,
  submit,
  validWords,
} from '@/games/wordWheel/engine/wordWheel.functions'

const VALID = validWords('parade\narea\npare\ndrape\nrap\ndear\n')

const PUZZLE = {
  letters: 'APARED',
  placements: [
    { word: 'PARADE', row: 0, col: 0, across: true },
    { word: 'AREA', row: 0, col: 1, across: false },
  ],
}

describe('submit', () => {
  it.each([
    ['area', GUESS.FOUND],
    ['pare', GUESS.BONUS],
    ['drape', GUESS.BONUS],
    ['zebra', GUESS.NOT_A_WORD],
    ['pa', GUESS.TOO_SHORT],
    ['dread', GUESS.NOT_A_WORD],
  ])('judges %s as %s', (word, expected) => {
    expect(
      submit({ game: newGame({ puzzle: PUZZLE }), word, valid: VALID }).last,
    ).toBe(expected)
  })

  it('marks a word found twice as already found', () => {
    const game = submit({
      game: newGame({ puzzle: PUZZLE }),
      word: 'area',
      valid: VALID,
    })

    const after = submit({ game, word: 'AREA', valid: VALID })

    expect([after.last, after.found]).toEqual([GUESS.ALREADY, ['AREA']])
  })

  it('is solved once every crossword word is found', () => {
    const after = ['parade', 'area'].reduce(
      (game, word) => submit({ game, word, valid: VALID }),
      newGame({ puzzle: PUZZLE }),
    )

    expect(isSolved(after)).toBe(true)
  })
})

describe('reveal', () => {
  it('shows the first hidden cell and counts a word completed by hints', () => {
    const game = submit({
      game: newGame({ puzzle: PUZZLE }),
      word: 'parade',
      valid: VALID,
    })

    const after = [1, 2, 3].reduce(
      (state) => reveal({ game: state, pick: (hidden) => hidden[0] }),
      game,
    )

    expect([isSolved(after), after.found]).toEqual([true, ['PARADE', 'AREA']])
  })
})

describe('shuffleWheel', () => {
  it('reorders the wheel letters', () => {
    const after = shuffleWheel({
      game: newGame({ puzzle: PUZZLE }),
      order: [5, 4, 3, 2, 1, 0],
    })

    expect(after.wheel).toBe('DERAPA')
  })
})

describe('fits', () => {
  it.each([
    ['PARADE', true],
    ['PAPER', false],
  ])('checks whether %s can be spelt from the wheel', (word, expected) => {
    expect(fits({ word, letters: 'APARED' })).toBe(expected)
  })
})
