import { GUESS, MIN_WORD } from '@/common/wordWheel/wordWheel.constants'
import type {
  Guess,
  Puzzle,
  WordWheelGame,
} from '@/common/wordWheel/wordWheel.types'
import {
  cellKey,
  letterAt,
  placementCells,
  puzzleWords,
} from '@/common/wordWheel/wordWheelCrossword.functions'

export function fits({ word, letters }: { word: string; letters: string }) {
  const left = new Map<string, number>()
  for (const letter of letters) {
    left.set(letter, (left.get(letter) ?? 0) + 1)
  }
  return [...word].every((letter) => {
    const count = left.get(letter) ?? 0
    left.set(letter, count - 1)
    return count > 0
  })
}

export function isSolved(game: WordWheelGame): boolean {
  return [...puzzleWords(game.puzzle)].every((word) =>
    game.found.includes(word),
  )
}

export function newGame({
  puzzle,
  found = [],
  bonus = [],
  revealed = [],
}: {
  puzzle: Puzzle
  found?: string[]
  bonus?: string[]
  revealed?: string[]
}): WordWheelGame {
  return { puzzle, found, bonus, revealed, wheel: puzzle.letters, last: null }
}

export function reveal({
  game,
  pick,
}: {
  game: WordWheelGame
  pick: (hidden: string[]) => string | undefined
}): WordWheelGame {
  const cell = pick(hiddenCells(game))
  if (cell === undefined) {
    return game
  }
  const withCell = { ...game, revealed: [...game.revealed, cell], last: null }
  const shown = shownCells(withCell)
  const completed = game.puzzle.placements
    .filter(
      (placement) =>
        !game.found.includes(placement.word) &&
        placementCells(placement).every((it) => shown.has(cellKey(it))),
    )
    .map((placement) => placement.word)
  return { ...withCell, found: [...game.found, ...completed] }
}

export function revealAll(game: WordWheelGame): WordWheelGame {
  return { ...game, found: [...puzzleWords(game.puzzle)], last: null }
}

export function shownCells(game: WordWheelGame): Set<string> {
  return new Set([
    ...game.puzzle.placements
      .filter((placement) => game.found.includes(placement.word))
      .flatMap((placement) => placementCells(placement).map(cellKey)),
    ...game.revealed,
  ])
}

export function shuffleWheel({
  game,
  order,
}: {
  game: WordWheelGame
  order: number[]
}): WordWheelGame {
  return {
    ...game,
    wheel: order.map((index) => game.wheel[index]).join(''),
    last: null,
  }
}

export function submit({
  game,
  word,
  valid,
}: {
  game: WordWheelGame
  word: string
  valid: Set<string>
}): WordWheelGame {
  if (isSolved(game)) {
    return game
  }
  const guess = word.toUpperCase()
  const result = judge({ game, guess, valid })
  if (result === GUESS.FOUND) {
    return { ...game, found: [...game.found, guess], last: result }
  }
  if (result === GUESS.BONUS) {
    return { ...game, bonus: [...game.bonus, guess], last: result }
  }
  return { ...game, last: result }
}

export function validWords(text: string): Set<string> {
  return new Set(
    text
      .split('\n')
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0),
  )
}

function hiddenCells(game: WordWheelGame): string[] {
  const shown = shownCells(game)
  return [...letterAt(game.puzzle).keys()]
    .filter((key) => !shown.has(key))
    .sort((a, b) => {
      const [rowA, colA] = a.split(',').map(Number)
      const [rowB, colB] = b.split(',').map(Number)
      return rowA - rowB || colA - colB
    })
}

function judge({
  game,
  guess,
  valid,
}: {
  game: WordWheelGame
  guess: string
  valid: Set<string>
}): Guess {
  if (guess.length < MIN_WORD) {
    return GUESS.TOO_SHORT
  }
  if (game.found.includes(guess) || game.bonus.includes(guess)) {
    return GUESS.ALREADY
  }
  if (puzzleWords(game.puzzle).has(guess)) {
    return GUESS.FOUND
  }
  if (valid.has(guess) && fits({ word: guess, letters: game.puzzle.letters })) {
    return GUESS.BONUS
  }
  return GUESS.NOT_A_WORD
}
