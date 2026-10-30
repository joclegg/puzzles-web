import type {
  Difficulty,
  EntryProblem,
  GameMode,
  Grid,
  HighlightStyle,
  InputMode,
  MistakeCheck,
  PlayOptions,
} from '@/common/sudoku/sudoku.types'

export const NO_CAGE = -1

export const DIFFICULTY = {
  FAST: 'fast',
  BEGINNER: 'beginner',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
  EVIL: 'evil',
} as const

export const DIFFICULTY_ORDER: readonly Difficulty[] = Object.values(DIFFICULTY)

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  [DIFFICULTY.FAST]: 'Fast',
  [DIFFICULTY.BEGINNER]: 'Beginner',
  [DIFFICULTY.EASY]: 'Easy',
  [DIFFICULTY.MEDIUM]: 'Medium',
  [DIFFICULTY.HARD]: 'Hard',
  [DIFFICULTY.EXPERT]: 'Expert',
  [DIFFICULTY.EVIL]: 'Evil',
}

export const GAME_MODE = {
  CLASSIC: 'classic',
  KILLER: 'killer',
} as const

export const GAME_MODES: readonly GameMode[] = Object.values(GAME_MODE)

export const GAME_MODE_LABEL: Record<GameMode, string> = {
  [GAME_MODE.CLASSIC]: 'Classic',
  [GAME_MODE.KILLER]: 'Killer',
}

export const LEVELS: Record<GameMode, readonly Difficulty[]> = {
  [GAME_MODE.CLASSIC]: [
    DIFFICULTY.FAST,
    DIFFICULTY.EASY,
    DIFFICULTY.MEDIUM,
    DIFFICULTY.HARD,
    DIFFICULTY.EXPERT,
  ],
  [GAME_MODE.KILLER]: DIFFICULTY_ORDER,
}

export const INPUT_MODE = {
  CELL_FIRST: 'cellFirst',
  DIGIT_FIRST: 'digitFirst',
} as const

export const INPUT_MODE_LABEL: Record<InputMode, string> = {
  [INPUT_MODE.CELL_FIRST]: 'Cell first',
  [INPUT_MODE.DIGIT_FIRST]: 'Number first',
}

export const MISTAKE_CHECK = {
  OFF: 'off',
  BLOCK_CLASHES: 'blockClashes',
  SHOW_WRONG: 'showWrong',
} as const

export const MISTAKE_CHECK_LABEL: Record<MistakeCheck, string> = {
  [MISTAKE_CHECK.OFF]: 'Off',
  [MISTAKE_CHECK.BLOCK_CLASHES]: 'Block clashes',
  [MISTAKE_CHECK.SHOW_WRONG]: 'Show wrong',
}

export const HIGHLIGHT = {
  SELECTED: 'selected',
  SAME_DIGIT: 'sameDigit',
  NOTE_MATCH: 'noteMatch',
  PEER: 'peer',
  NONE: 'none',
} as const

export const HIGHLIGHT_STYLE = {
  CELL: 'cell',
  NUMBER: 'number',
  OFF: 'off',
} as const

export const HIGHLIGHT_STYLE_LABEL: Record<HighlightStyle, string> = {
  [HIGHLIGHT_STYLE.CELL]: 'Cell',
  [HIGHLIGHT_STYLE.NUMBER]: 'Number',
  [HIGHLIGHT_STYLE.OFF]: 'Off',
}

export const DEFAULT_OPTIONS: PlayOptions = {
  highlightHouses: true,
  highlightCage: true,
  sameNumberStyle: HIGHLIGHT_STYLE.CELL,
  notesStyle: HIGHLIGHT_STYLE.CELL,
  autoRemoveNotes: true,
  highlightLastPlaced: true,
}

export const STANDARD_GRID: Grid = makeGrid({ size: 9, boxRows: 3, boxCols: 3 })

export const FAST_GRID: Grid = makeGrid({ size: 6, boxRows: 2, boxCols: 3 })

export const DAILY_SEED_STRIDE = 31n

export const BANK_SIZE = 10_000

export const TECHNIQUES: readonly {
  name: string
  level: Difficulty
  weight: number
  killerOnly: boolean
}[] = [
  { name: 'nakedSingle', level: DIFFICULTY.EASY, weight: 1, killerOnly: false },
  {
    name: 'hiddenSingle',
    level: DIFFICULTY.EASY,
    weight: 2,
    killerOnly: false,
  },
  {
    name: 'cageCombination',
    level: DIFFICULTY.EASY,
    weight: 3,
    killerOnly: true,
  },
  {
    name: 'lockedCandidates',
    level: DIFFICULTY.MEDIUM,
    weight: 8,
    killerOnly: false,
  },
  {
    name: 'nakedPair',
    level: DIFFICULTY.MEDIUM,
    weight: 10,
    killerOnly: false,
  },
  {
    name: 'hiddenPair',
    level: DIFFICULTY.MEDIUM,
    weight: 12,
    killerOnly: false,
  },
  { name: 'ruleOf45', level: DIFFICULTY.MEDIUM, weight: 12, killerOnly: true },
  {
    name: 'nakedTriple',
    level: DIFFICULTY.HARD,
    weight: 20,
    killerOnly: false,
  },
  {
    name: 'hiddenTriple',
    level: DIFFICULTY.HARD,
    weight: 25,
    killerOnly: false,
  },
  { name: 'xWing', level: DIFFICULTY.HARD, weight: 30, killerOnly: false },
  { name: 'xyWing', level: DIFFICULTY.HARD, weight: 35, killerOnly: false },
  {
    name: 'nakedQuad',
    level: DIFFICULTY.EXPERT,
    weight: 40,
    killerOnly: false,
  },
  {
    name: 'swordfish',
    level: DIFFICULTY.EXPERT,
    weight: 50,
    killerOnly: false,
  },
  { name: 'xyzWing', level: DIFFICULTY.EXPERT, weight: 55, killerOnly: false },
]

export const EFFORT_PER_EXTRA_COMBINATION = 4

function makeGrid({
  size,
  boxRows,
  boxCols,
}: {
  size: number
  boxRows: number
  boxCols: number
}): Grid {
  const cells = size * size
  const boxesPerRow = size / boxCols
  const rowOf = Array.from({ length: cells }, (_, cell) =>
    Math.floor(cell / size),
  )
  const colOf = Array.from({ length: cells }, (_, cell) => cell % size)
  const boxOf = rowOf.map(
    (row, cell) =>
      Math.floor(row / boxRows) * boxesPerRow +
      Math.floor(colOf[cell] / boxCols),
  )
  const all = Array.from({ length: cells }, (_, cell) => cell)
  const rows = Array.from({ length: size }, (_, r) =>
    all.filter((cell) => rowOf[cell] === r),
  )
  const cols = Array.from({ length: size }, (_, c) =>
    all.filter((cell) => colOf[cell] === c),
  )
  const boxes = Array.from({ length: size }, (_, b) =>
    all.filter((cell) => boxOf[cell] === b),
  )
  return {
    size,
    boxRows,
    boxCols,
    cells,
    allDigits: Array.from({ length: size }, (_, i) => 1 << (i + 1)).reduce(
      (a, b) => a | b,
      0,
    ),
    rowOf,
    colOf,
    boxOf,
    rows,
    cols,
    boxes,
    houses: [...rows, ...cols, ...boxes],
    peers: all.map((cell) =>
      all.filter(
        (other) =>
          other !== cell &&
          (rowOf[other] === rowOf[cell] ||
            colOf[other] === colOf[cell] ||
            boxOf[other] === boxOf[cell]),
      ),
    ),
  }
}

export const ENTRY_PROBLEM = {
  EMPTY: 'empty',
  NOT_CONNECTED: 'notConnected',
  IMPOSSIBLE_SUM: 'impossibleSum',
  NO_SOLUTION: 'noSolution',
  MULTIPLE_SOLUTIONS: 'multipleSolutions',
  TOO_HARD_TO_CHECK: 'tooHardToCheck',
} as const

export const ENTRY_PROBLEM_MESSAGE: Record<EntryProblem, string> = {
  [ENTRY_PROBLEM.EMPTY]: "Pick the cage's cells and type its sum first.",
  [ENTRY_PROBLEM.NOT_CONNECTED]: "A cage's cells must touch each other.",
  [ENTRY_PROBLEM.IMPOSSIBLE_SUM]: 'No set of different numbers makes that sum.',
  [ENTRY_PROBLEM.NO_SOLUTION]:
    'This puzzle has no answer, so there may be a typo.',
  [ENTRY_PROBLEM.MULTIPLE_SOLUTIONS]: 'This puzzle has more than one answer.',
  [ENTRY_PROBLEM.TOO_HARD_TO_CHECK]:
    'Checking this puzzle would take too long.',
}
