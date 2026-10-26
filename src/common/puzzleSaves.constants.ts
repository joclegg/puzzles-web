export const PUZZLE_STATUS = {
  IN_PROGRESS: 'inProgress',
  SOLVED: 'solved',
  ABANDONED: 'abandoned',
} as const

export const PUZZLE_STATUS_LABEL = {
  [PUZZLE_STATUS.IN_PROGRESS]: 'In progress',
  [PUZZLE_STATUS.SOLVED]: 'Solved',
  [PUZZLE_STATUS.ABANDONED]: 'Abandoned',
}

export const DAILY_PREFIX = 'daily_'
