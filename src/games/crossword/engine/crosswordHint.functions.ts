import { EMPTY } from '@/games/crossword/engine/crossword.constants'
import { currentWord } from '@/games/crossword/engine/crossword.functions'
import type {
  CrosswordGame,
  CrosswordHint,
} from '@/games/crossword/engine/crossword.types'

export function findHint(game: CrosswordGame): CrosswordHint | null {
  const { puzzle, entries } = game
  const wrong = entries.findIndex(
    (entry, cell) => entry !== EMPTY && entry !== puzzle.solution[cell],
  )
  if (wrong !== -1) {
    return {
      cell: wrong,
      letter: puzzle.solution[wrong],
      message: 'This letter is wrong.',
    }
  }
  const words = puzzle.words
  const index = words.indexOf(currentWord(game))
  const cell = Array.from(
    { length: words.length },
    (_, offset) => words[(index + offset) % words.length],
  )
    .map((word) => word.cells.find((it) => entries[it] === EMPTY))
    .find((it) => it !== undefined)
  if (cell === undefined) {
    return null
  }
  const letter = puzzle.solution[cell]
  return { cell, letter, message: `Try ${letter} here.` }
}
