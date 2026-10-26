import { describe, expect, it } from 'vitest'

import classicEasy from '@/assets/sudoku-samples/classic_easy.txt?raw'
import { DIFFICULTY } from '@/common/sudoku/sudoku.constants'
import {
  cageProblem,
  checkPuzzle,
  isConnected,
} from '@/common/sudoku/sudokuEntry.functions'
import { decodePuzzle } from '@/common/sudoku/sudokuPuzzle.functions'

const EASY = decodePuzzle(classicEasy.split('\n')[0])

describe('checkPuzzle', () => {
  it('accepts a puzzle with one answer and grades it', () => {
    const result = checkPuzzle({ givens: EASY.givens, cages: [] })

    expect([result.problem, result.solution, result.level]).toEqual([
      null,
      EASY.solution,
      DIFFICULTY.EASY,
    ])
  })

  it('spots a puzzle with more than one answer', () => {
    expect(checkPuzzle({ givens: Array(81).fill(0), cages: [] }).problem).toBe(
      'multipleSolutions',
    )
  })

  it('spots a puzzle with clashing numbers', () => {
    const givens = Array(81).fill(0)
    givens[0] = 5
    givens[1] = 5

    expect(checkPuzzle({ givens, cages: [] }).problem).toBe('noSolution')
  })
})

describe('cageProblem', () => {
  it.each([
    [[0, 1], 3, null],
    [[0, 2], 3, 'notConnected'],
    [[0, 1], 2, 'impossibleSum'],
    [[], 4, 'empty'],
  ])('checks cells %j summing to %i', (cells, sum, problem) => {
    expect(cageProblem({ cells, sum })).toBe(problem)
  })
})

describe('isConnected', () => {
  it('follows a bent cage', () => {
    expect(isConnected([0, 9, 10, 11])).toBe(true)
  })
})
