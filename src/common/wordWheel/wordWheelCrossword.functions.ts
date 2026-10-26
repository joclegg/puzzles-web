import type { Placement, Puzzle } from '@/common/wordWheel/wordWheel.types'

export function cellKey({ row, col }: { row: number; col: number }): string {
  return `${row},${col}`
}

export function crosswordSize(puzzle: Puzzle): { rows: number; cols: number } {
  const cells = puzzle.placements.flatMap(placementCells)
  return {
    rows: Math.max(...cells.map((cell) => cell.row)) + 1,
    cols: Math.max(...cells.map((cell) => cell.col)) + 1,
  }
}

export function decodePuzzle(text: string): Puzzle {
  const [letters, crossword] = text.split(';')
  return {
    letters,
    placements: crossword.split('|').map((code) => {
      const [word, position] = code.split('@')
      const [row, col, direction] = position.split(',')
      return {
        word,
        row: Number(row),
        col: Number(col),
        across: direction === 'A',
      }
    }),
  }
}

export function letterAt(puzzle: Puzzle): Map<string, string> {
  const letters = new Map<string, string>()
  for (const placement of puzzle.placements) {
    placementCells(placement).forEach((cell, index) =>
      letters.set(cellKey(cell), placement.word[index]),
    )
  }
  return letters
}

export function placementCells(placement: Placement) {
  return [...placement.word].map((_, step) =>
    placement.across
      ? { row: placement.row, col: placement.col + step }
      : { row: placement.row + step, col: placement.col },
  )
}

export function puzzleWords(puzzle: Puzzle): Set<string> {
  return new Set(puzzle.placements.map((placement) => placement.word))
}
