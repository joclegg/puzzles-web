export const SIZES = [11, 13, 15]

export const FIRST_DAY = '2026-11-16'

export const DAILY_POOL = 3000

export const BLOCK = '#'

export const EMPTY = '.'

export const SENTINEL = ' '

export const CLUES_PATH = 'crossword/clues.txt'

export const SIZE_NAME: Record<number, string> = {
  11: 'Small',
  13: 'Medium',
  15: 'Large',
}

export const SIZE_PATH: Record<number, string> = {
  11: 'crossword/small.txt',
  13: 'crossword/medium.txt',
  15: 'crossword/large.txt',
}

export const ARROW_MOVES: Record<string, { isAcross: boolean; step: number }> =
  {
    ArrowLeft: { isAcross: true, step: -1 },
    ArrowRight: { isAcross: true, step: 1 },
    ArrowUp: { isAcross: false, step: -1 },
    ArrowDown: { isAcross: false, step: 1 },
  }
