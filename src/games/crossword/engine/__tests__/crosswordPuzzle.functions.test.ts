import { describe, expect, it } from 'vitest'

import clues from '@data/crossword/clues.txt?raw'
import large from '@data/crossword/large.txt?raw'
import medium from '@data/crossword/medium.txt?raw'
import small from '@data/crossword/small.txt?raw'
import {
  clueLabel,
  createPuzzle,
  decodePuzzle,
  parseClues,
} from '@/games/crossword/engine/crosswordPuzzle.functions'

const CLUES = parseClues(clues)

describe('createPuzzle', () => {
  it('numbers the words in reading order, across then down', () => {
    const puzzle = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

    expect(puzzle.words).toEqual([
      { number: 1, isAcross: true, cells: [0, 1, 2], answer: 'CAT' },
      { number: 3, isAcross: true, cells: [6, 7, 8], answer: 'WIP' },
      { number: 1, isAcross: false, cells: [0, 3, 6], answer: 'COW' },
      { number: 2, isAcross: false, cells: [2, 5, 8], answer: 'TOP' },
    ])
    expect([...puzzle.numbers]).toEqual([
      [0, 1],
      [2, 2],
      [6, 3],
    ])
  })
})

describe('decodePuzzle', () => {
  it.each([
    ['small', small, 11],
    ['medium', medium, 13],
    ['large', large, 15],
  ])('reads the first %s grid', (_, bank, size) => {
    const puzzle = decodePuzzle(bank.split('\n')[0])

    expect(puzzle.size).toBe(size)
    expect(puzzle.solution).toHaveLength(size * size)
    expect(puzzle.words.every((word) => word.cells.length >= 2)).toBe(true)
  })

  it('finds a clue for every answer in the first grids', () => {
    const answers = [small, medium, large].flatMap((bank) =>
      bank
        .split('\n')
        .slice(0, 20)
        .flatMap((line) => decodePuzzle(line).words.map((word) => word.answer)),
    )

    expect(answers.filter((answer) => !CLUES.has(answer))).toEqual([])
  })
})

describe('clueLabel', () => {
  it('adds the enumeration', () => {
    const puzzle = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

    expect(
      clueLabel({
        clues: new Map([['CAT', 'Pet that purrs']]),
        word: puzzle.words[0],
      }),
    ).toBe('Pet that purrs (3)')
  })
})

describe('parseClues', () => {
  it('reads WORD;clue lines', () => {
    expect([...parseClues('ABACK;Taken ___, surprised\nCAT;A; pet\n')]).toEqual(
      [
        ['ABACK', 'Taken ___, surprised'],
        ['CAT', 'A; pet'],
      ],
    )
  })
})
