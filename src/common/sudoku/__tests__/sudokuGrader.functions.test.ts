import { describe, expect, it } from 'vitest'

import classicEasy from '@/assets/sudoku-samples/classic_easy.txt?raw'
import classicExpert from '@/assets/sudoku-samples/classic_expert.txt?raw'
import classicFast from '@/assets/sudoku-samples/classic_fast.txt?raw'
import killerBeginner from '@/assets/sudoku-samples/killer_beginner.txt?raw'
import killerEvil from '@/assets/sudoku-samples/killer_evil.txt?raw'
import killerMedium from '@/assets/sudoku-samples/killer_medium.txt?raw'

import { DIFFICULTY } from '@/common/sudoku/sudoku.constants'
import { grade } from '@/common/sudoku/sudokuGrader.functions'
import { decodePuzzle } from '@/common/sudoku/sudokuPuzzle.functions'
import { countSolutions } from '@/common/sudoku/sudokuSolver.functions'

const SAMPLES: Record<string, string> = {
  classic_fast: classicFast,
  classic_easy: classicEasy,
  classic_expert: classicExpert,
  killer_beginner: killerBeginner,
  killer_medium: killerMedium,
  killer_evil: killerEvil,
}

function firstPuzzles(file: string) {
  return SAMPLES[file]
    .split('\n')
    .filter((line) => line.length > 0)
    .map(decodePuzzle)
}

describe('grade', { timeout: 20_000 }, () => {
  it.each([
    [
      'classic_fast',
      ['easy/18/nakedSingle', 'easy/20/nakedSingle', 'easy/20/nakedSingle'],
    ],
    [
      'classic_easy',
      ['easy/44/nakedSingle', 'easy/44/nakedSingle', 'easy/44/nakedSingle'],
    ],
    [
      'classic_expert',
      ['expert/99/nakedQuad', 'expert/104/xyzWing', 'expert/105/swordfish'],
    ],
    [
      'killer_beginner',
      ['easy/49/nakedSingle', 'easy/49/nakedSingle', 'easy/49/nakedSingle'],
    ],
    [
      'killer_medium',
      [
        'easy/140/cageCombination',
        'easy/140/cageCombination',
        'easy/140/cageCombination',
      ],
    ],
    [
      'killer_evil',
      ['medium/900/ruleOf45', 'expert/900/nakedQuad', 'medium/900/ruleOf45'],
    ],
  ])('grades the first %s puzzles with fixed results', (file, expected) => {
    const grades = firstPuzzles(file).map((puzzle) => {
      const result = grade({
        givens: puzzle.givens,
        cages: puzzle.cages,
        maxLevel: DIFFICULTY.EVIL,
      })
      return `${result.level}/${result.score}/${result.hardest}`
    })

    expect(grades).toEqual(expected)
  })
})

describe('countSolutions', { timeout: 20_000 }, () => {
  it.each(['classic_expert', 'killer_evil'])(
    'finds one solution for %s puzzles',
    (file) => {
      const counts = firstPuzzles(file).map((puzzle) =>
        countSolutions({ givens: puzzle.givens, cages: puzzle.cages }),
      )

      expect(counts).toEqual([1, 1, 1])
    },
  )

  it('finds many solutions for an empty grid', () => {
    expect(countSolutions({ givens: Array(81).fill(0), limit: 2 })).toBe(2)
  })
})
