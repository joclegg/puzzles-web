import {
  DEFAULT_OPTIONS,
  HIGHLIGHT,
  HIGHLIGHT_STYLE,
  INPUT_MODE,
  MISTAKE_CHECK,
  NO_CAGE,
} from '@/common/sudoku/sudoku.constants'
import type {
  Cage,
  CellChange,
  Highlight,
  InputMode,
  MistakeCheck,
  PlayOptions,
  Puzzle,
  SudokuGame,
  SudokuHint,
} from '@/common/sudoku/sudoku.types'
import { digitBit, gridFor } from '@/common/sudoku/sudokuPuzzle.functions'

export function conflicts({
  values,
  cages = [],
}: {
  values: number[]
  cages?: Cage[]
}) {
  const bad = new Set<number>()
  const groups = [
    ...gridFor(values.length).houses,
    ...cages.map((cage) => cage.cells),
  ]
  for (const group of groups) {
    const byDigit = new Map<number, number[]>()
    for (const cell of group) {
      if (values[cell] !== 0) {
        byDigit.set(values[cell], [...(byDigit.get(values[cell]) ?? []), cell])
      }
    }
    for (const cells of byDigit.values()) {
      if (cells.length > 1) {
        cells.forEach((cell) => bad.add(cell))
      }
    }
  }
  for (const cage of cages) {
    const filled = cage.cells.filter((cell) => values[cell] !== 0)
    const total = filled.reduce((sum, cell) => sum + values[cell], 0)
    if (
      total > cage.sum ||
      (filled.length === cage.cells.length && total !== cage.sum)
    ) {
      filled.forEach((cell) => bad.add(cell))
    }
  }
  return bad
}

export function countsMistakes(game: SudokuGame): boolean {
  return effectiveMistakeCheck(game) !== MISTAKE_CHECK.OFF
}

export function digitCount({
  game,
  digit,
}: {
  game: SudokuGame
  digit: number
}) {
  return game.values.filter((value) => value === digit).length
}

export function erase(game: SudokuGame): SudokuGame {
  if (isComplete(game)) {
    return game
  }
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return {
      ...game,
      eraserActive: !game.eraserActive,
      markActive: false,
      activeDigit: null,
      rejected: null,
    }
  }
  return game.selected === null ? game : clear({ game, cell: game.selected })
}

export function highlightOf({
  game,
  cell,
}: {
  game: SudokuGame
  cell: number
}): Highlight {
  const digit = highlightDigit(game)
  const shownSelection =
    !game.options.highlightLastPlaced && game.selected === game.lastPlaced
      ? null
      : game.selected
  if (cell === shownSelection) {
    return HIGHLIGHT.SELECTED
  }
  if (
    game.options.sameNumberStyle === HIGHLIGHT_STYLE.CELL &&
    digit !== null &&
    game.values[cell] === digit
  ) {
    return HIGHLIGHT.SAME_DIGIT
  }
  if (
    game.options.notesStyle === HIGHLIGHT_STYLE.CELL &&
    digit !== null &&
    game.values[cell] === 0 &&
    (game.notes[cell] & digitBit(digit)) !== 0
  ) {
    return HIGHLIGHT.NOTE_MATCH
  }
  if (
    shownSelection !== null &&
    isHighlightedPeer({ game, a: shownSelection, b: cell })
  ) {
    return HIGHLIGHT.PEER
  }
  return HIGHLIGHT.NONE
}

export function isCageWrong({
  game,
  cage,
}: {
  game: SudokuGame
  cage: Cage
}): boolean {
  if (!isChecking(game) || cage.cells.some((cell) => game.values[cell] === 0)) {
    return false
  }
  const digits = cage.cells.map((cell) => game.values[cell])
  const total = digits.reduce((sum, digit) => sum + digit, 0)
  return total !== cage.sum || new Set(digits).size !== digits.length
}

export function isComplete(game: SudokuGame): boolean {
  if (game.values.some((value) => value === 0)) {
    return false
  }
  const solution = game.puzzle.solution
  return solution !== null
    ? solution.every((digit, cell) => digit === game.values[cell])
    : conflicts({ values: game.values, cages: game.puzzle.cages }).size === 0
}

export function isDigitDone({
  game,
  digit,
}: {
  game: SudokuGame
  digit: number
}) {
  const right = game.values.filter(
    (value, cell) => value === digit && !isWrong({ game, cell }),
  ).length
  return right >= game.puzzle.grid.size
}

export function isGiven({ game, cell }: { game: SudokuGame; cell: number }) {
  return game.puzzle.givens[cell] !== 0
}

export function isNumberHighlighted({
  game,
  cell,
}: {
  game: SudokuGame
  cell: number
}) {
  const digit = highlightDigit(game)
  return (
    game.options.sameNumberStyle === HIGHLIGHT_STYLE.NUMBER &&
    digit !== null &&
    game.values[cell] === digit
  )
}

export function isWrong({
  game,
  cell,
}: {
  game: SudokuGame
  cell: number
}): boolean {
  const solution = game.puzzle.solution
  return (
    solution !== null &&
    isChecking(game) &&
    !isGiven({ game, cell }) &&
    game.values[cell] !== 0 &&
    game.values[cell] !== solution[cell]
  )
}

export function mark(game: SudokuGame): SudokuGame {
  if (isComplete(game)) {
    return game
  }
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return {
      ...game,
      markActive: !game.markActive,
      eraserActive: false,
      activeDigit: null,
      rejected: null,
    }
  }
  return game.selected === null
    ? game
    : toggleMark({ game, cell: game.selected })
}

export function newGame({
  puzzle,
  inputMode = INPUT_MODE.CELL_FIRST,
  mistakeCheck = MISTAKE_CHECK.SHOW_WRONG,
  options = DEFAULT_OPTIONS,
}: {
  puzzle: Puzzle
  inputMode?: InputMode
  mistakeCheck?: MistakeCheck
  options?: PlayOptions
}): SudokuGame {
  return {
    puzzle,
    values: [...puzzle.givens],
    notes: puzzle.givens.map(() => 0),
    selected: null,
    activeDigit: null,
    inputMode,
    notesMode: false,
    mistakeCheck,
    mistakes: 0,
    undoStack: [],
    redoStack: [],
    options,
    rejected: null,
    eraserActive: false,
    lastPlaced: null,
    marked: new Set(),
    markActive: false,
  }
}

export function noteHighlightDigit(game: SudokuGame): number | null {
  return game.options.notesStyle === HIGHLIGHT_STYLE.NUMBER
    ? highlightDigit(game)
    : null
}

export function placeHint({
  game,
  hint,
}: {
  game: SudokuGame
  hint: SudokuHint
}): SudokuGame {
  return enter({
    game: { ...game, notesMode: false, selected: hint.cell },
    cell: hint.cell,
    digit: hint.digit,
  })
}

export function redo(game: SudokuGame): SudokuGame {
  const next = game.redoStack.at(-1)
  if (isComplete(game) || next === undefined) {
    return game
  }
  return {
    ...applied({ game, move: next }),
    undoStack: [...game.undoStack, snapshot({ game, move: next })],
    redoStack: game.redoStack.slice(0, -1),
  }
}

export function restart(game: SudokuGame): SudokuGame {
  return newGame({
    puzzle: game.puzzle,
    inputMode: game.inputMode,
    mistakeCheck: game.mistakeCheck,
    options: game.options,
  })
}

export function revealSolution(game: SudokuGame): SudokuGame {
  const solution = game.puzzle.solution
  if (solution === null) {
    return game
  }
  return {
    ...game,
    values: [...solution],
    notes: game.notes.map(() => 0),
    selected: null,
    activeDigit: null,
    rejected: null,
  }
}

export function tapCell({
  game,
  cell,
}: {
  game: SudokuGame
  cell: number
}): SudokuGame {
  if (isComplete(game)) {
    return game
  }
  const next = { ...game, selected: cell, rejected: null }
  if (game.inputMode !== INPUT_MODE.DIGIT_FIRST) {
    return next
  }
  if (game.markActive) {
    return toggleMark({ game: next, cell })
  }
  if (game.eraserActive) {
    return clear({ game: next, cell })
  }
  if (game.activeDigit !== null) {
    return enter({ game: next, cell, digit: game.activeDigit })
  }
  return next
}

export function tapDigit({
  game,
  digit,
}: {
  game: SudokuGame
  digit: number
}): SudokuGame {
  if (isComplete(game)) {
    return game
  }
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return {
      ...game,
      markActive: false,
      activeDigit: game.activeDigit === digit ? null : digit,
      eraserActive: false,
      rejected: null,
    }
  }
  return game.selected === null
    ? game
    : enter({ game: { ...game, rejected: null }, cell: game.selected, digit })
}

export function toggleNotesMode(game: SudokuGame): SudokuGame {
  return { ...game, notesMode: !game.notesMode }
}

export function undo(game: SudokuGame): SudokuGame {
  const last = game.undoStack.at(-1)
  if (isComplete(game) || last === undefined) {
    return game
  }
  return {
    ...applied({ game, move: last }),
    undoStack: game.undoStack.slice(0, -1),
    redoStack: [...game.redoStack, snapshot({ game, move: last })],
  }
}

function applied({
  game,
  move,
}: {
  game: SudokuGame
  move: CellChange[]
}): SudokuGame {
  const values = [...game.values]
  const notes = [...game.notes]
  for (const change of move) {
    values[change.cell] = change.value
    notes[change.cell] = change.notes
  }
  return { ...game, values, notes, rejected: null, lastPlaced: null }
}

function clear({ game, cell }: { game: SudokuGame; cell: number }): SudokuGame {
  if (
    isGiven({ game, cell }) ||
    (game.values[cell] === 0 && game.notes[cell] === 0)
  ) {
    return game
  }
  return record({
    game,
    next: {
      ...game,
      values: replaced({ list: game.values, index: cell, value: 0 }),
      notes: replaced({ list: game.notes, index: cell, value: 0 }),
      rejected: null,
    },
  })
}

function effectiveMistakeCheck(game: SudokuGame): MistakeCheck {
  return game.mistakeCheck === MISTAKE_CHECK.SHOW_WRONG &&
    game.puzzle.solution === null
    ? MISTAKE_CHECK.BLOCK_CLASHES
    : game.mistakeCheck
}

function enter({
  game,
  cell,
  digit,
}: {
  game: SudokuGame
  cell: number
  digit: number
}): SudokuGame {
  if (isGiven({ game, cell })) {
    return game
  }
  if (game.notesMode) {
    if (game.values[cell] !== 0) {
      return game
    }
    return record({
      game,
      next: {
        ...game,
        notes: replaced({
          list: game.notes,
          index: cell,
          value: game.notes[cell] ^ digitBit(digit),
        }),
        lastPlaced: cell,
      },
    })
  }
  if (game.values[cell] === digit) {
    return record({
      game,
      next: {
        ...game,
        values: replaced({ list: game.values, index: cell, value: 0 }),
        lastPlaced: null,
      },
    })
  }
  if (effectiveMistakeCheck(game) === MISTAKE_CHECK.BLOCK_CLASHES) {
    const clashes = new Set(
      game.values.flatMap((value, other) =>
        isPeer({ game, a: cell, b: other }) && value === digit ? [other] : [],
      ),
    )
    if (clashes.size > 0) {
      return {
        ...game,
        rejected: { cell, clashes },
        mistakes: game.mistakes + 1,
      }
    }
  }
  const wrong = isChecking(game) && game.puzzle.solution![cell] !== digit
  const clearBit = ~digitBit(digit)
  const cleaned = game.notes.map((mask, i) =>
    i === cell
      ? 0
      : game.options.autoRemoveNotes && isPeer({ game, a: cell, b: i })
        ? mask & clearBit
        : mask,
  )
  return record({
    game,
    next: {
      ...game,
      values: replaced({ list: game.values, index: cell, value: digit }),
      notes: cleaned,
      mistakes: game.mistakes + (wrong ? 1 : 0),
      lastPlaced: cell,
    },
  })
}

function highlightDigit(game: SudokuGame): number | null {
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return game.activeDigit
  }
  const value = game.selected === null ? 0 : game.values[game.selected]
  return value === 0 ? null : value
}

function isChecking(game: SudokuGame): boolean {
  return effectiveMistakeCheck(game) === MISTAKE_CHECK.SHOW_WRONG
}

function isHighlightedPeer({
  game,
  a,
  b,
}: {
  game: SudokuGame
  a: number
  b: number
}) {
  return (
    a !== b &&
    ((game.options.highlightHouses && sharesHouse({ game, a, b })) ||
      (game.options.highlightCage && sharesCage({ game, a, b })))
  )
}

function isPeer({ game, a, b }: { game: SudokuGame; a: number; b: number }) {
  return a !== b && (sharesHouse({ game, a, b }) || sharesCage({ game, a, b }))
}

function record({
  game,
  next,
}: {
  game: SudokuGame
  next: SudokuGame
}): SudokuGame {
  const changed = game.values.flatMap((value, cell) =>
    value !== next.values[cell] || game.notes[cell] !== next.notes[cell]
      ? [{ cell, value, notes: game.notes[cell] }]
      : [],
  )
  return { ...next, undoStack: [...game.undoStack, changed], redoStack: [] }
}

function replaced({
  list,
  index,
  value,
}: {
  list: number[]
  index: number
  value: number
}) {
  const copy = [...list]
  copy[index] = value
  return copy
}

function sharesCage({
  game,
  a,
  b,
}: {
  game: SudokuGame
  a: number
  b: number
}) {
  const index = game.puzzle.cageIndexByCell
  return index[a] !== NO_CAGE && index[a] === index[b]
}

function sharesHouse({
  game,
  a,
  b,
}: {
  game: SudokuGame
  a: number
  b: number
}) {
  const grid = game.puzzle.grid
  return (
    grid.rowOf[a] === grid.rowOf[b] ||
    grid.colOf[a] === grid.colOf[b] ||
    grid.boxOf[a] === grid.boxOf[b]
  )
}

function snapshot({
  game,
  move,
}: {
  game: SudokuGame
  move: CellChange[]
}): CellChange[] {
  return move.map((change) => ({
    cell: change.cell,
    value: game.values[change.cell],
    notes: game.notes[change.cell],
  }))
}

function toggleMark({
  game,
  cell,
}: {
  game: SudokuGame
  cell: number
}): SudokuGame {
  const marked = new Set(game.marked)
  if (marked.has(cell)) {
    marked.delete(cell)
  } else {
    marked.add(cell)
  }
  return { ...game, marked }
}
