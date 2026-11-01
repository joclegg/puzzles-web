import type { SudokuGame, SudokuHint } from '@/common/sudoku/sudoku.types'
import { digitBit } from '@/common/sudoku/sudokuPuzzle.functions'

export function findHint(game: SudokuGame): SudokuHint | null {
  const { grid, solution } = game.puzzle
  const values = game.values
  if (solution !== null) {
    const wrong = values.findIndex(
      (value, cell) => value !== 0 && value !== solution[cell],
    )
    if (wrong !== -1) {
      return {
        cell: wrong,
        digit: solution[wrong],
        message: 'This cell is wrong.',
      }
    }
  }
  const candidates = values.map((value, cell) =>
    value !== 0
      ? 0
      : grid.peers[cell].reduce(
          (mask, peer) =>
            values[peer] === 0 ? mask : mask & ~digitBit(values[peer]),
          grid.allDigits,
        ),
  )
  const single = candidates.findIndex((mask) => bitCount(mask) === 1)
  if (single !== -1) {
    const digit = digitsOf(candidates[single])[0]
    return { cell: single, digit, message: `Only ${digit} fits here.` }
  }
  for (const [name, houses] of [
    ['row', grid.rows],
    ['column', grid.cols],
    ['box', grid.boxes],
  ] as const) {
    for (const house of houses) {
      for (let digit = 1; digit <= grid.size; digit++) {
        const places = house.filter(
          (cell) => (candidates[cell] & digitBit(digit)) !== 0,
        )
        if (places.length === 1) {
          return {
            cell: places[0],
            digit,
            message: `${digit} can only go here in this ${name}.`,
          }
        }
      }
    }
  }
  if (solution === null) {
    return null
  }
  const empty = values
    .map((value, cell) => (value === 0 ? cell : -1))
    .filter((cell) => cell !== -1)
  if (empty.length === 0) {
    return null
  }
  const cell = empty.reduce((best, each) =>
    bitCount(candidates[each]) < bitCount(candidates[best]) ? each : best,
  )
  return {
    cell,
    digit: solution[cell],
    message: `This cell can only be ${listDigits(digitsOf(candidates[cell]))}: everything else is in its row, column or box.`,
  }
}

function bitCount(mask: number) {
  return digitsOf(mask).length
}

function digitsOf(mask: number) {
  return Array.from({ length: 31 }, (_, digit) => digit).filter(
    (digit) => digit > 0 && (mask & digitBit(digit)) !== 0,
  )
}

function listDigits(digits: number[]): string {
  return digits.length <= 1
    ? digits.join('')
    : `${digits.slice(0, -1).join(', ')} or ${digits[digits.length - 1]}`
}
