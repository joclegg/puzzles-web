import {
  COMBINATION_ORDER,
  INPUT_MODE,
  MISTAKE_CHECK,
} from '@/common/kakuro/kakuro.constants'
import type {
  Change,
  CombinationLine,
  CombinationOrder,
  InputMode,
  KakuroGame,
  KakuroHint,
  MistakeCheck,
  Puzzle,
  Run,
} from '@/common/kakuro/kakuro.types'
import { bit, digitsOf, masksFor } from '@/common/kakuro/kakuroPuzzle.functions'

export function brokenRuns(game: KakuroGame): Run[] {
  return game.puzzle.runs.filter((run) => {
    const placed = run.cells
      .map((cell) => game.values[cell])
      .filter((value) => value !== 0)
    const total = placed.reduce((sum, value) => sum + value, 0)
    return (
      placed.length !== new Set(placed).size ||
      total > run.sum ||
      (placed.length === run.cells.length && total !== run.sum)
    )
  })
}

export function combinationLines({
  game,
  order = COMBINATION_ORDER.INCREASING,
}: {
  game: KakuroGame
  order?: CombinationOrder
}): CombinationLine[] {
  const direction = order === COMBINATION_ORDER.DECREASING ? -1 : 1
  return selectedCombinations(game).map(({ run, masks, placed }) => ({
    label: `${run.isAcross ? 'Across' : 'Down'} ${run.sum} in ${run.cells.length}`,
    options: masks
      .map((mask) =>
        digitsOf(mask)
          .sort((a, b) => (a - b) * direction)
          .map((digit) => ({
            digit,
            placed: (placed & bit(digit)) !== 0,
          })),
      )
      .sort(
        (a, b) =>
          compareDigits({
            a: a.map((it) => it.digit),
            b: b.map((it) => it.digit),
          }) * direction,
      ),
  }))
}

export function decodeChanges(text: string): Change[] {
  return text
    .split(';')
    .filter((it) => it.length > 0)
    .map((it) => {
      const parts = it.split(',')
      const [cell, fromValue, fromNotes, toValue, toNotes] = parts
        .slice(0, 5)
        .map(Number)
      const clearedNotes = parts[5]?.split(':').map(Number) ?? []
      return { cell, fromValue, fromNotes, toValue, toNotes, clearedNotes }
    })
}

export function encodeChanges(changes: Change[]): string {
  return changes
    .map((change) => {
      const cleared = change.clearedNotes.join(':')
      const base = `${change.cell},${change.fromValue},${change.fromNotes},${change.toValue},${change.toNotes}`
      return cleared.length === 0 ? base : `${base},${cleared}`
    })
    .join(';')
}

export function erase(game: KakuroGame): KakuroGame {
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return {
      ...game,
      eraserActive: !game.eraserActive,
      markActive: false,
      activeDigit: null,
      rejected: null,
    }
  }
  const cell = game.selected
  if (cell === null || isSolved(game) || isGiven({ game, cell })) {
    return game
  }
  return setCell({ game, cell, value: 0, cellNotes: 0 })
}

export function isDigitDone({
  game,
  digit,
}: {
  game: KakuroGame
  digit: number
}) {
  const needed = game.puzzle.solution.filter((it) => it === digit).length
  const placed = game.values.filter(
    (value, cell) => value === digit && value === game.puzzle.solution[cell],
  ).length
  return needed > 0 && placed === needed
}

export function isSolved(game: KakuroGame): boolean {
  return game.values.every(
    (value, cell) => value === game.puzzle.solution[cell],
  )
}

export function mark(game: KakuroGame): KakuroGame {
  if (isSolved(game)) {
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
  autoRemoveNotes = true,
}: {
  puzzle: Puzzle
  inputMode?: InputMode
  mistakeCheck?: MistakeCheck
  autoRemoveNotes?: boolean
}): KakuroGame {
  return {
    puzzle,
    values: puzzle.solution.map((digit, cell) =>
      puzzle.givens.has(cell) ? digit : 0,
    ),
    notes: puzzle.solution.map(() => 0),
    changes: [],
    selected: null,
    notesMode: false,
    inputMode,
    mistakeCheck,
    activeDigit: null,
    eraserActive: false,
    mistakes: 0,
    rejected: null,
    autoRemoveNotes,
    undone: [],
    marked: new Set(),
    markActive: false,
  }
}

export function placeHint({
  game,
  hint,
}: {
  game: KakuroGame
  hint: KakuroHint
}): KakuroGame {
  return place({
    game: { ...game, notesMode: false, selected: hint.cell, rejected: null },
    cell: hint.cell,
    digit: hint.digit,
  })
}

export function redo(game: KakuroGame): KakuroGame {
  const next = game.undone.at(-1)
  if (next === undefined || isSolved(game)) {
    return game
  }
  return {
    ...game,
    values: replaced({
      list: game.values,
      index: next.cell,
      value: next.toValue,
    }),
    notes: applyNotes({ notes: game.notes, change: next }),
    changes: [...game.changes, next],
    selected: next.cell,
    undone: game.undone.slice(0, -1),
  }
}

export function replay({
  game,
  changes,
}: {
  game: KakuroGame
  changes: Change[]
}): KakuroGame {
  return changes.reduce(
    (state, change) => ({
      ...state,
      values: replaced({
        list: state.values,
        index: change.cell,
        value: change.toValue,
      }),
      notes: applyNotes({ notes: state.notes, change }),
      changes: [...state.changes, change],
    }),
    game,
  )
}

export function restart(game: KakuroGame): KakuroGame {
  return newGame({
    puzzle: game.puzzle,
    inputMode: game.inputMode,
    mistakeCheck: game.mistakeCheck,
    autoRemoveNotes: game.autoRemoveNotes,
  })
}

export function revealSolution(game: KakuroGame): KakuroGame {
  return {
    ...game,
    values: [...game.puzzle.solution],
    notes: game.notes.map(() => 0),
    selected: null,
    rejected: null,
  }
}

export function runCellsOf(game: KakuroGame): Set<number> {
  if (game.selected === null) {
    return new Set()
  }
  return new Set(
    (game.puzzle.runsOf.get(game.selected) ?? []).flatMap((run) => run.cells),
  )
}

export function shownWrongCells(game: KakuroGame): Set<number> {
  const inBrokenRuns = brokenRuns(game).flatMap((run) =>
    run.cells.filter((cell) => game.values[cell] !== 0),
  )
  if (game.mistakeCheck === MISTAKE_CHECK.SHOW_WRONG) {
    return new Set([...wrongCells(game), ...inBrokenRuns])
  }
  if (game.mistakeCheck === MISTAKE_CHECK.BLOCK_CLASHES) {
    return new Set(inBrokenRuns)
  }
  return new Set()
}

export function tapCell({ game, cell }: { game: KakuroGame; cell: number }) {
  if (!game.puzzle.isWhite[cell]) {
    return game
  }
  const selectedHere = { ...game, selected: cell, rejected: null }
  if (
    game.inputMode === INPUT_MODE.DIGIT_FIRST &&
    game.markActive &&
    !isSolved(game)
  ) {
    return toggleMark({ game: selectedHere, cell })
  }
  if (
    game.inputMode === INPUT_MODE.CELL_FIRST ||
    isSolved(game) ||
    isGiven({ game, cell })
  ) {
    return selectedHere
  }
  if (game.eraserActive) {
    return setCell({ game: selectedHere, cell, value: 0, cellNotes: 0 })
  }
  if (game.activeDigit !== null) {
    return place({ game: selectedHere, cell, digit: game.activeDigit })
  }
  return selectedHere
}

export function tapDigit({ game, digit }: { game: KakuroGame; digit: number }) {
  if (game.inputMode === INPUT_MODE.DIGIT_FIRST) {
    return {
      ...game,
      activeDigit: game.activeDigit === digit ? null : digit,
      eraserActive: false,
      markActive: false,
      rejected: null,
    }
  }
  const cell = game.selected
  if (cell === null || isSolved(game) || isGiven({ game, cell })) {
    return game
  }
  return place({ game: { ...game, rejected: null }, cell, digit })
}

export function toggleNotes(game: KakuroGame): KakuroGame {
  return { ...game, notesMode: !game.notesMode }
}

export function undo(game: KakuroGame): KakuroGame {
  const last = game.changes.at(-1)
  if (last === undefined || isSolved(game)) {
    return game
  }
  const restored = last.clearedNotes.reduce(
    (all, other) =>
      replaced({
        list: all,
        index: other,
        value: all[other] | bit(last.toValue),
      }),
    replaced({ list: game.notes, index: last.cell, value: last.fromNotes }),
  )
  return {
    ...game,
    values: replaced({
      list: game.values,
      index: last.cell,
      value: last.fromValue,
    }),
    notes: restored,
    changes: game.changes.slice(0, -1),
    selected: last.cell,
    undone: [...game.undone, last],
  }
}

function applyNotes({ notes, change }: { notes: number[]; change: Change }) {
  return change.clearedNotes.reduce(
    (all, other) =>
      replaced({
        list: all,
        index: other,
        value: all[other] & ~bit(change.toValue),
      }),
    replaced({ list: notes, index: change.cell, value: change.toNotes }),
  )
}

function compareDigits({ a, b }: { a: number[]; b: number[] }): number {
  const index = a.findIndex((digit, at) => digit !== b[at])
  return index === -1 ? a.length - b.length : a[index] - b[index]
}

function isGiven({ game, cell }: { game: KakuroGame; cell: number }) {
  return game.puzzle.givens.has(cell)
}

function place({
  game,
  cell,
  digit,
}: {
  game: KakuroGame
  cell: number
  digit: number
}): KakuroGame {
  if (game.notesMode) {
    if (game.values[cell] !== 0) {
      return game
    }
    return setCell({
      game,
      cell,
      value: 0,
      cellNotes: game.notes[cell] ^ bit(digit),
    })
  }
  if (game.values[cell] === digit) {
    return setCell({ game, cell, value: 0, cellNotes: game.notes[cell] })
  }
  const clashes = (game.puzzle.runsOf.get(cell) ?? []).some((run) =>
    run.cells.some((other) => other !== cell && game.values[other] === digit),
  )
  if (game.mistakeCheck === MISTAKE_CHECK.BLOCK_CLASHES) {
    return clashes
      ? { ...game, rejected: cell, mistakes: game.mistakes + 1 }
      : setCell({ game, cell, value: digit, cellNotes: 0 })
  }
  const placed = setCell({ game, cell, value: digit, cellNotes: 0 })
  if (
    game.mistakeCheck === MISTAKE_CHECK.SHOW_WRONG &&
    digit !== game.puzzle.solution[cell]
  ) {
    return { ...placed, mistakes: game.mistakes + 1 }
  }
  return placed
}

function replaced({
  list,
  index,
  value,
}: {
  list: number[]
  index: number
  value: number
}): number[] {
  const copy = [...list]
  copy[index] = value
  return copy
}

function selectedCombinations(game: KakuroGame) {
  const cell = game.selected
  if (cell === null) {
    return []
  }
  return (game.puzzle.runsOf.get(cell) ?? []).map((run) => {
    const placed = run.cells
      .filter((other) => game.values[other] !== 0)
      .reduce((mask, other) => mask | bit(game.values[other]), 0)
    return {
      run,
      placed,
      masks: masksFor({ length: run.cells.length, sum: run.sum }).filter(
        (mask) => (mask & placed) === placed,
      ),
    }
  })
}

function setCell({
  game,
  cell,
  value,
  cellNotes,
}: {
  game: KakuroGame
  cell: number
  value: number
  cellNotes: number
}): KakuroGame {
  if (game.values[cell] === value && game.notes[cell] === cellNotes) {
    return game
  }
  const cleared =
    value !== 0 && game.autoRemoveNotes
      ? [
          ...new Set(
            (game.puzzle.runsOf.get(cell) ?? []).flatMap((run) => run.cells),
          ),
        ].filter(
          (other) => other !== cell && (game.notes[other] & bit(value)) !== 0,
        )
      : []
  const change: Change = {
    cell,
    fromValue: game.values[cell],
    fromNotes: game.notes[cell],
    toValue: value,
    toNotes: cellNotes,
    clearedNotes: cleared,
  }
  return {
    ...game,
    values: replaced({ list: game.values, index: cell, value }),
    notes: applyNotes({ notes: game.notes, change }),
    changes: [...game.changes, change],
    undone: [],
  }
}

function toggleMark({ game, cell }: { game: KakuroGame; cell: number }) {
  const marked = new Set(game.marked)
  if (marked.has(cell)) {
    marked.delete(cell)
  } else {
    marked.add(cell)
  }
  return { ...game, marked }
}

function wrongCells(game: KakuroGame): Set<number> {
  return new Set(
    game.values.flatMap((value, cell) =>
      value !== 0 && value !== game.puzzle.solution[cell] ? [cell] : [],
    ),
  )
}
