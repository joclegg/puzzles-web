import { describe, expect, it } from 'vitest'

import {
  applyInput,
  backspace,
  currentWord,
  decodeChanges,
  encodeChanges,
  encodeEntries,
  isSolved,
  loadGame,
  moveArrow,
  newGame,
  nextClue,
  pressKey,
  redo,
  revealLetter,
  revealWord,
  selectWord,
  tapCell,
  typeLetter,
  undo,
  wrongCells,
} from '@/games/crossword/engine/crossword.functions'
import type { CrosswordGame } from '@/games/crossword/engine/crossword.types'
import { createPuzzle } from '@/games/crossword/engine/crosswordPuzzle.functions'

const SMALL = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

function keys({ game, presses }: { game: CrosswordGame; presses: string[] }) {
  return presses.reduce(
    (state, key) => pressKey({ game: state, key }) ?? state,
    game,
  )
}

describe('typing', () => {
  it('starts on the first across clue', () => {
    const game = newGame({ puzzle: SMALL })

    expect(game.selected).toBe(0)
    expect(game.isAcross).toBe(true)
  })

  it('puts an uppercase letter in the cell and moves along the word', () => {
    const game = typeLetter({ game: newGame({ puzzle: SMALL }), letter: 'c' })

    expect(encodeEntries(game)).toBe('C...#....')
    expect(game.selected).toBe(1)
  })

  it('moves to the first empty cell of the next clue when a word is done', () => {
    const game = keys({
      game: newGame({ puzzle: SMALL }),
      presses: ['C', 'A', 'T'],
    })

    expect(encodeEntries(game)).toBe('CAT.#....')
    expect(game.selected).toBe(6)
    expect(game.isAcross).toBe(true)
  })

  it('skips filled cells of the word', () => {
    const start = keys({
      game: tapCell({ game: newGame({ puzzle: SMALL }), cell: 1 }),
      presses: ['A'],
    })

    const game = keys({
      game: tapCell({ game: start, cell: 0 }),
      presses: ['C'],
    })

    expect(game.selected).toBe(2)
  })

  it('goes to the last cell when only earlier cells are empty', () => {
    const start = {
      ...tapCell({ game: newGame({ puzzle: SMALL }), cell: 1 }),
      entries: [...'..T.#....'],
    }

    const game = typeLetter({ game: start, letter: 'A' })

    expect(game.selected).toBe(2)
  })

  it('counts wrong letters only while mistakes are shown', () => {
    const shown = { ...newGame({ puzzle: SMALL }), showMistakes: true }

    expect(typeLetter({ game: shown, letter: 'X' }).mistakes).toBe(1)
    expect(
      typeLetter({ game: newGame({ puzzle: SMALL }), letter: 'X' }).mistakes,
    ).toBe(0)
  })

  it('types over filled cells with skipping off', () => {
    const start = keys({
      game: tapCell({
        game: newGame({ puzzle: SMALL, skipFilledCells: false }),
        cell: 1,
      }),
      presses: ['A'],
    })

    const game = keys({
      game: tapCell({ game: start, cell: 0 }),
      presses: ['C', 'X'],
    })

    expect(encodeEntries(game)).toBe('CX..#....')
    expect(game.selected).toBe(2)
  })

  it('replaces the letter in the current cell', () => {
    const game = keys({
      game: newGame({ puzzle: SMALL, skipFilledCells: false }),
      presses: ['X', 'ArrowLeft', 'C'],
    })

    expect(encodeEntries(game)).toBe('C...#....')
  })

  it('stays put once the whole grid is full', () => {
    const game = keys({
      game: newGame({ puzzle: SMALL }),
      presses: [...'CATWIPOO'],
    })

    expect(isSolved(game)).toBe(true)
    expect(game.selected).toBe(5)
  })

  it('ignores digits and punctuation', () => {
    const game = newGame({ puzzle: SMALL })

    expect(pressKey({ game, key: '7' })).toBe(game)
    expect(pressKey({ game, key: '.' })).toBe(game)
    expect(pressKey({ game, key: 'Enter' })).toBeNull()
    expect(pressKey({ game, key: 'Unidentified' })).toBeNull()
  })
})

describe('backspace', () => {
  it('clears C A T in turn after typing them, ending on the C cell', () => {
    const typed = keys({
      game: newGame({ puzzle: SMALL }),
      presses: ['C', 'A', 'T'],
    })

    const once = backspace(typed)
    const twice = backspace(once)
    const thrice = backspace(twice)

    expect(encodeEntries(once)).toBe('CA..#....')
    expect(once.selected).toBe(2)
    expect(encodeEntries(twice)).toBe('C...#....')
    expect(twice.selected).toBe(1)
    expect(encodeEntries(thrice)).toBe('....#....')
    expect(thrice.selected).toBe(0)
  })

  it('clears a filled cell and stays on it', () => {
    const typed = keys({
      game: newGame({ puzzle: SMALL }),
      presses: ['C', 'A', 'ArrowLeft'],
    })

    const game = backspace(typed)

    expect(encodeEntries(game)).toBe('C...#....')
    expect(game.selected).toBe(1)
  })

  it('moves back and clears the previous cell from an empty cell', () => {
    const typed = keys({
      game: newGame({ puzzle: SMALL }),
      presses: ['C', 'A'],
    })

    const game = backspace(typed)

    expect(encodeEntries(game)).toBe('C...#....')
    expect(game.selected).toBe(1)
  })

  it('moves to the last cell of the previous clue from the start of a word', () => {
    const start = keys({
      game: nextClue({ game: newGame({ puzzle: SMALL }), step: 1 }),
      presses: [],
    })
    const filled = { ...start, entries: [...'CAT.#....'] }

    const game = backspace(filled)

    expect(game.selected).toBe(2)
    expect(game.isAcross).toBe(true)
    expect(encodeEntries(game)).toBe('CA..#....')
  })

  it('wraps from the first clue to the last down clue', () => {
    const game = backspace(newGame({ puzzle: SMALL }))

    expect(game.selected).toBe(8)
    expect(game.isAcross).toBe(false)
  })

  it('never needs two presses for one letter', () => {
    const typed = keys({
      game: newGame({ puzzle: SMALL }),
      presses: [...'CATWI'],
    })

    const game = keys({
      game: typed,
      presses: Array.from({ length: 5 }, () => 'Backspace'),
    })

    expect(encodeEntries(game)).toBe('....#....')
    expect(game.selected).toBe(0)
  })
})

describe('selection', () => {
  it('toggles direction when the selected cell is tapped again', () => {
    const game = tapCell({ game: newGame({ puzzle: SMALL }), cell: 0 })

    expect(game.isAcross).toBe(false)
    expect(currentWord(game).answer).toBe('COW')
  })

  it('uses the only direction a cell has', () => {
    const game = tapCell({ game: newGame({ puzzle: SMALL }), cell: 3 })

    expect(game.isAcross).toBe(false)
  })

  it('ignores blocks', () => {
    const game = newGame({ puzzle: SMALL })

    expect(tapCell({ game, cell: 4 })).toBe(game)
  })

  it('switches direction with a perpendicular arrow before moving', () => {
    const turned = moveArrow({
      game: newGame({ puzzle: SMALL }),
      isAcross: false,
      step: 1,
    })
    const moved = moveArrow({ game: turned, isAcross: false, step: 1 })

    expect(turned.selected).toBe(0)
    expect(turned.isAcross).toBe(false)
    expect(moved.selected).toBe(3)
  })

  it('jumps over blocks with the arrows', () => {
    const game = keys({
      game: tapCell({ game: newGame({ puzzle: SMALL }), cell: 1 }),
      presses: ['ArrowDown', 'ArrowDown'],
    })

    expect(game.selected).toBe(7)
  })

  it('toggles direction with Space', () => {
    const game = keys({ game: newGame({ puzzle: SMALL }), presses: [' '] })

    expect(game.isAcross).toBe(false)
  })

  it('moves through the clues with Tab and Shift+Tab, wrapping', () => {
    const game = newGame({ puzzle: SMALL })
    const back = pressKey({ game, key: 'Tab', shiftKey: true })

    expect(currentWord(nextClue({ game, step: 1 })).answer).toBe('WIP')
    expect(back && currentWord(back).answer).toBe('TOP')
  })

  it('lands on the first empty cell of a clue', () => {
    const game = selectWord({
      game: { ...newGame({ puzzle: SMALL }), entries: [...'CA..#....'] },
      word: SMALL.words[0],
    })

    expect(game.selected).toBe(2)
  })
})

describe('mobile input', () => {
  it('reads a letter typed after the sentinel', () => {
    const game = applyInput({ game: newGame({ puzzle: SMALL }), value: ' c' })

    expect(encodeEntries(game)).toBe('C...#....')
  })

  it('reads an emptied field as backspace', () => {
    const typed = keys({ game: newGame({ puzzle: SMALL }), presses: ['C'] })

    const game = applyInput({ game: typed, value: '' })

    expect(encodeEntries(game)).toBe('....#....')
    expect(game.selected).toBe(0)
  })

  it('reads a typed space as a direction toggle', () => {
    const game = applyInput({ game: newGame({ puzzle: SMALL }), value: '  ' })

    expect(game.isAcross).toBe(false)
  })
})

describe('saves', () => {
  it('round-trips the changes', () => {
    const game = keys({ game: newGame({ puzzle: SMALL }), presses: [...'CA'] })

    expect(encodeChanges(game.changes)).toBe('0.C,1.A')
    expect(decodeChanges(encodeChanges(game.changes))).toEqual(game.changes)
  })

  it('loads a game from its changes', () => {
    const game = loadGame({ puzzle: SMALL, changes: '0.C,1.A' })

    expect(encodeEntries(game)).toBe('CA..#....')
    expect(game.changes).toHaveLength(2)
    expect(game.selected).toBe(2)
  })

  it('falls back to the entries when the changes were trimmed', () => {
    const game = loadGame({ puzzle: SMALL, changes: '', entries: 'CAT.#....' })

    expect(encodeEntries(game)).toBe('CAT.#....')
    expect(game.selected).toBe(6)
  })

  it('undoes and redoes a letter', () => {
    const typed = keys({ game: newGame({ puzzle: SMALL }), presses: [...'CA'] })

    const undone = undo(typed)
    const redone = redo(undone)

    expect(encodeEntries(undone)).toBe('C...#....')
    expect(undone.selected).toBe(1)
    expect(encodeEntries(redone)).toBe('CA..#....')
  })
})

describe('helpers', () => {
  it('finds wrong letters', () => {
    const game = keys({ game: newGame({ puzzle: SMALL }), presses: [...'CX'] })

    expect([...wrongCells(game)]).toEqual([1])
  })

  it('reveals a letter and a word, counting hints', () => {
    const letter = revealLetter(newGame({ puzzle: SMALL }))
    const word = revealWord(letter)

    expect(encodeEntries(letter)).toBe('C...#....')
    expect(encodeEntries(word)).toBe('CAT.#....')
    expect(word.hints).toBe(2)
  })
})
