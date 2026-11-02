import type { CellChange } from '@/games/sudoku/engine/sudoku.types'

export function decodeMoves(text: string): CellChange[][] {
  return text
    .split(';')
    .filter((it) => it.length > 0)
    .map((move) =>
      move.split(',').map((change) => {
        const [cell, value, notes] = change.split(':').map(Number)
        return { cell, value, notes }
      }),
    )
}

export function encodeMoves(moves: CellChange[][]): string {
  return moves
    .map((move) =>
      move.map((it) => `${it.cell}:${it.value}:${it.notes}`).join(','),
    )
    .join(';')
}
