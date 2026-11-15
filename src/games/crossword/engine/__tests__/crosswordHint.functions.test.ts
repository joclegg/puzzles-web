import { describe, expect, it } from 'vitest'

import {
  newGame,
  placeHint,
  selectWord,
  typeLetter,
  undo,
} from '@/games/crossword/engine/crossword.functions'
import type { CrosswordGame } from '@/games/crossword/engine/crossword.types'
import { findHint } from '@/games/crossword/engine/crosswordHint.functions'
import { createPuzzle } from '@/games/crossword/engine/crosswordPuzzle.functions'

const SMALL = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

function withEntries(entries: string): CrosswordGame {
  return { ...newGame({ puzzle: SMALL }), entries: [...entries] }
}

function wordOf({ number, isAcross }: { number: number; isAcross: boolean }) {
  const word = SMALL.words.find(
    (it) => it.number === number && it.isAcross === isAcross,
  )
  if (word === undefined) {
    throw new Error('missing word')
  }
  return word
}

describe('findHint', () => {
  it('points at a wrong letter before any empty cell', () => {
    const hint = findHint(withEntries('C..O#.X..'))

    expect(hint).toEqual({
      cell: 6,
      letter: 'W',
      message: 'This letter is wrong.',
    })
  })

  it('points at the first wrong letter in reading order', () => {
    const hint = findHint(withEntries('..XO#.XIP'))

    expect(hint?.cell).toBe(2)
  })

  it('points at the first empty cell of the current word', () => {
    const game = selectWord({
      game: withEntries('C..O#....'),
      word: wordOf({ number: 3, isAcross: true }),
    })

    expect(findHint(game)).toEqual({
      cell: 6,
      letter: 'W',
      message: 'Try W here.',
    })
  })

  it('moves to the next clue when the current word is full', () => {
    const game = {
      ...withEntries('CATO#.W..'),
      selected: 0,
      isAcross: true,
    }

    expect(findHint(game)?.cell).toBe(7)
  })

  it('wraps to the first clue after the last', () => {
    const game = {
      ...withEntries('C.TO#OWIP'),
      selected: 2,
      isAcross: false,
    }

    expect(findHint(game)?.cell).toBe(1)
  })

  it('gives no hint on a full correct grid', () => {
    expect(findHint(withEntries('CATO#OWIP'))).toBeNull()
  })
})

describe('placeHint', () => {
  it('fills the letter, counts the hint and undoes back to the old letter', () => {
    const game = typeLetter({ game: newGame({ puzzle: SMALL }), letter: 'X' })
    const hint = findHint(game)
    if (hint === null) {
      throw new Error('missing hint')
    }

    const filled = placeHint({ game, hint })

    expect(filled.entries[0]).toBe('C')
    expect(filled.hints).toBe(1)
    expect(filled.selected).toBe(0)
    expect(undo(filled).entries[0]).toBe('X')
  })
})
