import { BLOCK } from '@/games/crossword/engine/crossword.constants'
import type { Puzzle, Word } from '@/games/crossword/engine/crossword.types'

export function clueLabel({
  clues,
  word,
}: {
  clues: Map<string, string>
  word: Word
}): string {
  const clue = clues.get(word.answer) ?? ''
  return `${clue} (${word.cells.length})`.trim()
}

export function createPuzzle({
  size,
  solution,
}: {
  size: number
  solution: string[]
}): Puzzle {
  const isWhite = solution.map((letter) => letter !== BLOCK)
  const numbers = new Map<number, number>()
  const across: Word[] = []
  const down: Word[] = []
  for (const [cell, white] of isWhite.entries()) {
    if (!white) {
      continue
    }
    const row = Math.floor(cell / size)
    const column = cell % size
    const startsAcross =
      (column === 0 || !isWhite[cell - 1]) &&
      column + 1 < size &&
      isWhite[cell + 1]
    const startsDown =
      (row === 0 || !isWhite[cell - size]) &&
      row + 1 < size &&
      isWhite[cell + size]
    if (!startsAcross && !startsDown) {
      continue
    }
    const number = numbers.size + 1
    numbers.set(cell, number)
    if (startsAcross) {
      across.push(
        word({ size, solution, isWhite, start: cell, number, isAcross: true }),
      )
    }
    if (startsDown) {
      down.push(
        word({ size, solution, isWhite, start: cell, number, isAcross: false }),
      )
    }
  }
  return { size, solution, isWhite, numbers, words: [...across, ...down] }
}

export function decodePuzzle(text: string): Puzzle {
  const [size, solution] = text.split(';')
  return createPuzzle({ size: Number(size), solution: [...solution] })
}

export function parseClues(text: string): Map<string, string> {
  return new Map(
    text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes(';'))
      .map((line) => {
        const split = line.indexOf(';')
        return [line.slice(0, split), line.slice(split + 1)]
      }),
  )
}

function word({
  size,
  solution,
  isWhite,
  start,
  number,
  isAcross,
}: {
  size: number
  solution: string[]
  isWhite: boolean[]
  start: number
  number: number
  isAcross: boolean
}): Word {
  const step = isAcross ? 1 : size
  const cells: number[] = []
  for (
    let cell = start;
    cell < solution.length &&
    isWhite[cell] &&
    (!isAcross || Math.floor(cell / size) === Math.floor(start / size));
    cell += step
  ) {
    cells.push(cell)
  }
  return {
    number,
    isAcross,
    cells,
    answer: cells.map((cell) => solution[cell]).join(''),
  }
}
