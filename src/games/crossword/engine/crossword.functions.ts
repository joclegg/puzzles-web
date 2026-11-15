import {
  ARROW_MOVES,
  BLOCK,
  EMPTY,
  SENTINEL,
} from '@/games/crossword/engine/crossword.constants'
import type {
  Change,
  CrosswordGame,
  CrosswordHint,
  Puzzle,
  Word,
} from '@/games/crossword/engine/crossword.types'

export function applyInput({
  game,
  value,
}: {
  game: CrosswordGame
  value: string
}): CrosswordGame {
  if (value.length < SENTINEL.length) {
    return backspace(game)
  }
  const letters = [...value].filter((letter) => isLetter(letter))
  if (letters.length === 0) {
    return value.length > SENTINEL.length && value.trim() === ''
      ? toggleDirection(game)
      : game
  }
  return letters.reduce(
    (state, letter) => typeLetter({ game: state, letter }),
    game,
  )
}

export function backspace(game: CrosswordGame): CrosswordGame {
  if (isSolved(game)) {
    return game
  }
  const cell = game.selected
  if (game.entries[cell] !== EMPTY) {
    return setEntry({
      game: { ...game, jumpedFrom: null },
      cell,
      letter: EMPTY,
    })
  }
  if (game.jumpedFrom !== null) {
    return setEntry({
      game: {
        ...game,
        selected: game.jumpedFrom.cell,
        isAcross: game.jumpedFrom.isAcross,
        jumpedFrom: null,
      },
      cell: game.jumpedFrom.cell,
      letter: EMPTY,
    })
  }
  const word = currentWord(game)
  const index = word.cells.indexOf(cell)
  if (index > 0) {
    const previous = word.cells[index - 1]
    return setEntry({
      game: { ...game, selected: previous },
      cell: previous,
      letter: EMPTY,
    })
  }
  const words = game.puzzle.words
  const before = words[(words.indexOf(word) - 1 + words.length) % words.length]
  const last = before.cells[before.cells.length - 1]
  return setEntry({
    game: { ...game, selected: last, isAcross: before.isAcross },
    cell: last,
    letter: EMPTY,
  })
}

export function currentWord(game: CrosswordGame): Word {
  return (
    wordAt({
      puzzle: game.puzzle,
      cell: game.selected,
      isAcross: game.isAcross,
    }) ??
    wordAt({
      puzzle: game.puzzle,
      cell: game.selected,
      isAcross: !game.isAcross,
    }) ??
    game.puzzle.words[0]
  )
}

export function decodeChanges(text: string): Change[] {
  return text
    .split(',')
    .filter((it) => it.length > 2)
    .map((it) => {
      return {
        cell: Number(it.slice(0, -2)),
        from: it.slice(-2, -1),
        to: it.slice(-1),
      }
    })
}

export function encodeChanges(changes: Change[]): string {
  return changes
    .map((change) => `${change.cell}${change.from}${change.to}`)
    .join(',')
}

export function encodeEntries(game: CrosswordGame): string {
  return game.entries.join('')
}

export function isSolved(game: CrosswordGame): boolean {
  return game.entries.every(
    (entry, cell) => entry === game.puzzle.solution[cell],
  )
}

export function loadGame({
  puzzle,
  changes,
  entries,
  hints = 0,
  mistakes = 0,
  skipFilledCells = true,
}: {
  puzzle: Puzzle
  changes: string
  entries?: string
  hints?: number
  mistakes?: number
  skipFilledCells?: boolean
}): CrosswordGame {
  const start = { ...newGame({ puzzle, skipFilledCells }), hints, mistakes }
  const replayed = replay({ game: start, changes: decodeChanges(changes) })
  const loaded =
    entries === undefined ||
    entries.length !== puzzle.solution.length ||
    encodeEntries(replayed) === entries
      ? replayed
      : {
          ...start,
          entries: [...entries].map((entry, cell) =>
            puzzle.isWhite[cell] ? entry : BLOCK,
          ),
        }
  const open = puzzle.words.find((word) =>
    word.cells.some((cell) => loaded.entries[cell] === EMPTY),
  )
  return open === undefined ? loaded : selectWord({ game: loaded, word: open })
}

export function moveArrow({
  game,
  isAcross,
  step,
}: {
  game: CrosswordGame
  isAcross: boolean
  step: number
}): CrosswordGame {
  const { puzzle } = game
  if (
    isAcross !== game.isAcross &&
    wordAt({ puzzle, cell: game.selected, isAcross }) !== undefined
  ) {
    return { ...game, isAcross, jumpedFrom: null }
  }
  const row = Math.floor(game.selected / puzzle.size)
  const column = game.selected % puzzle.size
  for (let distance = 1; distance < puzzle.size; distance += 1) {
    const nextRow = isAcross ? row : row + step * distance
    const nextColumn = isAcross ? column + step * distance : column
    if (
      nextRow < 0 ||
      nextRow >= puzzle.size ||
      nextColumn < 0 ||
      nextColumn >= puzzle.size
    ) {
      return game
    }
    const cell = nextRow * puzzle.size + nextColumn
    if (puzzle.isWhite[cell]) {
      return select({ game, cell, isAcross: game.isAcross })
    }
  }
  return game
}

export function newGame({
  puzzle,
  skipFilledCells = true,
}: {
  puzzle: Puzzle
  skipFilledCells?: boolean
}): CrosswordGame {
  const first = puzzle.words[0]
  return {
    puzzle,
    entries: puzzle.solution.map((letter) =>
      letter === BLOCK ? BLOCK : EMPTY,
    ),
    changes: [],
    undone: [],
    selected: first?.cells[0] ?? 0,
    isAcross: first?.isAcross ?? true,
    skipFilledCells,
    hints: 0,
    mistakes: 0,
    showMistakes: false,
    jumpedFrom: null,
  }
}

export function nextClue({
  game,
  step,
}: {
  game: CrosswordGame
  step: number
}): CrosswordGame {
  const words = game.puzzle.words
  const index = words.indexOf(currentWord(game))
  return selectWord({
    game,
    word: words[(index + step + words.length) % words.length],
  })
}

export function placeHint({
  game,
  hint,
}: {
  game: CrosswordGame
  hint: CrosswordHint
}): CrosswordGame {
  if (isSolved(game)) {
    return game
  }
  return {
    ...setEntry({
      game: select({ game, cell: hint.cell, isAcross: game.isAcross }),
      cell: hint.cell,
      letter: hint.letter,
    }),
    hints: game.hints + 1,
  }
}

export function pointHint({
  game,
  hint,
}: {
  game: CrosswordGame
  hint: CrosswordHint
}): CrosswordGame {
  if (isSolved(game)) {
    return game
  }
  return {
    ...select({ game, cell: hint.cell, isAcross: game.isAcross }),
    hints: game.hints + 1,
  }
}

export function pressKey({
  game,
  key,
  shiftKey = false,
}: {
  game: CrosswordGame
  key: string
  shiftKey?: boolean
}): CrosswordGame | null {
  if (isLetter(key)) {
    return typeLetter({ game, letter: key })
  }
  if (key === 'Backspace') {
    return backspace(game)
  }
  if (key === 'Tab') {
    return nextClue({ game, step: shiftKey ? -1 : 1 })
  }
  if (key === ' ') {
    return toggleDirection(game)
  }
  const arrow = ARROW_MOVES[key]
  if (arrow !== undefined) {
    return moveArrow({ game, ...arrow })
  }
  return key.length === 1 ? game : null
}

export function redo(game: CrosswordGame): CrosswordGame {
  const next = game.undone.at(-1)
  if (next === undefined || isSolved(game)) {
    return game
  }
  return {
    ...select({
      game: {
        ...game,
        entries: replaced({
          list: game.entries,
          index: next.cell,
          value: next.to,
        }),
      },
      cell: next.cell,
      isAcross: game.isAcross,
    }),
    changes: [...game.changes, next],
    undone: game.undone.slice(0, -1),
  }
}

export function restart(game: CrosswordGame): CrosswordGame {
  return {
    ...newGame({
      puzzle: game.puzzle,
      skipFilledCells: game.skipFilledCells,
    }),
    showMistakes: game.showMistakes,
  }
}

export function revealLetter(game: CrosswordGame): CrosswordGame {
  return revealCells({ game, cells: [game.selected] })
}

export function revealSolution(game: CrosswordGame): CrosswordGame {
  return { ...game, entries: [...game.puzzle.solution], jumpedFrom: null }
}

export function revealWord(game: CrosswordGame): CrosswordGame {
  return revealCells({ game, cells: currentWord(game).cells })
}

export function selectWord({
  game,
  word,
}: {
  game: CrosswordGame
  word: Word
}): CrosswordGame {
  const cell =
    word.cells.find((it) => game.entries[it] === EMPTY) ?? word.cells[0]
  return { ...game, selected: cell, isAcross: word.isAcross, jumpedFrom: null }
}

export function tapCell({
  game,
  cell,
}: {
  game: CrosswordGame
  cell: number
}): CrosswordGame {
  if (!game.puzzle.isWhite[cell]) {
    return game
  }
  if (cell === game.selected) {
    return toggleDirection(game)
  }
  return select({ game, cell, isAcross: game.isAcross })
}

export function typeLetter({
  game,
  letter,
}: {
  game: CrosswordGame
  letter: string
}): CrosswordGame {
  if (!isLetter(letter) || isSolved(game)) {
    return game
  }
  const cell = game.selected
  const word = currentWord(game)
  const wrongLetter =
    game.showMistakes &&
    letter.toUpperCase() !== game.puzzle.solution[cell] &&
    letter.toUpperCase() !== game.entries[cell]
  const placed = setEntry({
    game: {
      ...game,
      isAcross: word.isAcross,
      jumpedFrom: null,
      mistakes: game.mistakes + (wrongLetter ? 1 : 0),
    },
    cell,
    letter: letter.toUpperCase(),
  })
  const after = word.cells.slice(word.cells.indexOf(cell) + 1)
  const target = game.skipFilledCells
    ? after.find((it) => placed.entries[it] === EMPTY)
    : after[0]
  if (target !== undefined) {
    return { ...placed, selected: target }
  }
  const wordFull = word.cells.every((it) => placed.entries[it] !== EMPTY)
  if (!wordFull) {
    return { ...placed, selected: word.cells[word.cells.length - 1] }
  }
  if (isFull(placed)) {
    return placed
  }
  const words = game.puzzle.words
  const index = words.indexOf(word)
  const next = Array.from(
    { length: words.length },
    (_, offset) => words[(index + 1 + offset) % words.length],
  ).find((it) => it.cells.some((other) => placed.entries[other] === EMPTY))
  if (next === undefined) {
    return placed
  }
  return {
    ...selectWord({ game: placed, word: next }),
    jumpedFrom: { cell, isAcross: word.isAcross },
  }
}

export function undo(game: CrosswordGame): CrosswordGame {
  const last = game.changes.at(-1)
  if (last === undefined || isSolved(game)) {
    return game
  }
  return {
    ...select({
      game: {
        ...game,
        entries: replaced({
          list: game.entries,
          index: last.cell,
          value: last.from,
        }),
      },
      cell: last.cell,
      isAcross: game.isAcross,
    }),
    changes: game.changes.slice(0, -1),
    undone: [...game.undone, last],
  }
}

export function wrongCells(game: CrosswordGame): Set<number> {
  return new Set(
    game.entries.flatMap((entry, cell) =>
      entry !== EMPTY && entry !== game.puzzle.solution[cell] ? [cell] : [],
    ),
  )
}

function isFull(game: CrosswordGame): boolean {
  return game.entries.every((entry) => entry !== EMPTY)
}

function isLetter(key: string): boolean {
  return /^[a-z]$/i.test(key)
}

function replaced({
  list,
  index,
  value,
}: {
  list: string[]
  index: number
  value: string
}): string[] {
  const copy = [...list]
  copy[index] = value
  return copy
}

function replay({
  game,
  changes,
}: {
  game: CrosswordGame
  changes: Change[]
}): CrosswordGame {
  return changes.reduce(
    (state, change) => ({
      ...state,
      entries: replaced({
        list: state.entries,
        index: change.cell,
        value: change.to,
      }),
      changes: [...state.changes, change],
    }),
    game,
  )
}

function revealCells({
  game,
  cells,
}: {
  game: CrosswordGame
  cells: number[]
}): CrosswordGame {
  if (isSolved(game)) {
    return game
  }
  const wrong = cells.filter(
    (cell) => game.entries[cell] !== game.puzzle.solution[cell],
  )
  if (wrong.length === 0) {
    return game
  }
  return {
    ...wrong.reduce<CrosswordGame>(
      (state, cell) =>
        setEntry({ game: state, cell, letter: game.puzzle.solution[cell] }),
      { ...game, jumpedFrom: null },
    ),
    hints: game.hints + 1,
  }
}

function select({
  game,
  cell,
  isAcross,
}: {
  game: CrosswordGame
  cell: number
  isAcross: boolean
}): CrosswordGame {
  const fits = wordAt({ puzzle: game.puzzle, cell, isAcross }) !== undefined
  return {
    ...game,
    selected: cell,
    isAcross: fits ? isAcross : !isAcross,
    jumpedFrom: null,
  }
}

function setEntry({
  game,
  cell,
  letter,
}: {
  game: CrosswordGame
  cell: number
  letter: string
}): CrosswordGame {
  if (game.entries[cell] === letter) {
    return game
  }
  return {
    ...game,
    entries: replaced({ list: game.entries, index: cell, value: letter }),
    changes: [...game.changes, { cell, from: game.entries[cell], to: letter }],
    undone: [],
  }
}

function toggleDirection(game: CrosswordGame): CrosswordGame {
  const other = wordAt({
    puzzle: game.puzzle,
    cell: game.selected,
    isAcross: !game.isAcross,
  })
  return other === undefined
    ? { ...game, jumpedFrom: null }
    : { ...game, isAcross: !game.isAcross, jumpedFrom: null }
}

function wordAt({
  puzzle,
  cell,
  isAcross,
}: {
  puzzle: Puzzle
  cell: number
  isAcross: boolean
}): Word | undefined {
  return puzzle.words.find(
    (word) => word.isAcross === isAcross && word.cells.includes(cell),
  )
}
