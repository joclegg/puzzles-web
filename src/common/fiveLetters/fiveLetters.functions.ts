import { daysBetween } from '@/common/date.functions'
import {
  DAILY_ORDER_SEED,
  FIRST_DAY,
  MARK,
  MARK_EMOJI,
  MARK_RANK,
  MAX_GUESSES,
  REJECTION,
  WORD_LENGTH,
} from '@/common/fiveLetters/fiveLetters.constants'
import type {
  FiveLettersGame,
  Mark,
  Rejection,
  Words,
} from '@/common/fiveLetters/fiveLetters.types'
import { createRandom, randomItem, shuffled } from '@/common/random.functions'

const LETTER = /^[a-z]$/i

export function createWords({
  answers,
  guesses,
}: {
  answers: string[]
  guesses: string[]
}): Words {
  const cleanAnswers = answers
    .map((word) => word.trim().toUpperCase())
    .filter((word) => word.length === WORD_LENGTH)
  const allowed = new Set([
    ...guesses.map((word) => word.trim().toUpperCase()),
    ...cleanAnswers,
  ])
  const dailyOrder = shuffled({
    items: cleanAnswers,
    random: createRandom(DAILY_ORDER_SEED),
  })
  return { answers: cleanAnswers, allowed, dailyOrder }
}

export function dailyWord({ words, date }: { words: Words; date: string }) {
  const index = dayNumber(date) - 1
  const size = words.dailyOrder.length
  return words.dailyOrder[((index % size) + size) % size]
}

export function dayNumber(date: string): number {
  return daysBetween({ from: FIRST_DAY, to: date }) + 1
}

export function deleteLetter(game: FiveLettersGame): FiveLettersGame {
  if (isOver(game) || game.typing.length === 0) {
    return game
  }
  return { ...game, typing: game.typing.slice(0, -1), rejection: null }
}

export function guessMarks(game: FiveLettersGame): Mark[][] {
  return game.guesses.map((guess) => score({ guess, answer: game.answer }))
}

export function isLost(game: FiveLettersGame): boolean {
  return !isWon(game) && game.guesses.length === MAX_GUESSES
}

export function isOver(game: FiveLettersGame): boolean {
  return isWon(game) || isLost(game)
}

export function isWon(game: FiveLettersGame): boolean {
  return game.guesses.includes(game.answer)
}

export function letterMarks(game: FiveLettersGame): Map<string, Mark> {
  const best = new Map<string, Mark>()
  const marks = guessMarks(game)
  game.guesses.forEach((guess, row) => {
    ;[...guess].forEach((letter, column) => {
      const mark = marks[row][column]
      const current = best.get(letter)
      if (current === undefined || MARK_RANK[mark] < MARK_RANK[current]) {
        best.set(letter, mark)
      }
    })
  })
  return best
}

export function newGame({
  answer,
  guesses = [],
  hardMode = false,
}: {
  answer: string
  guesses?: string[]
  hardMode?: boolean
}): FiveLettersGame {
  return { answer, guesses, typing: '', hardMode, rejection: null }
}

export function randomWord({ words, seed }: { words: Words; seed: bigint }) {
  return randomItem({ items: words.answers, random: createRandom(seed) })
}

export function score({
  guess,
  answer,
}: {
  guess: string
  answer: string
}): Mark[] {
  const marks: Mark[] = Array.from({ length: WORD_LENGTH }, () => MARK.ABSENT)
  const unmatched = new Map<string, number>()
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      marks[i] = MARK.CORRECT
    } else {
      unmatched.set(answer[i], (unmatched.get(answer[i]) ?? 0) + 1)
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    const left = unmatched.get(guess[i]) ?? 0
    if (marks[i] !== MARK.CORRECT && left > 0) {
      marks[i] = MARK.PRESENT
      unmatched.set(guess[i], left - 1)
    }
  }
  return marks
}

export function shareText({
  game,
  title,
}: {
  game: FiveLettersGame
  title: string
}): string {
  const result = isWon(game) ? String(game.guesses.length) : 'X'
  const grid = guessMarks(game)
    .map((row) => row.map((mark) => MARK_EMOJI[mark]).join(''))
    .join('\n')
  const mode = game.hardMode ? '*' : ''
  return `${title} ${result}/${MAX_GUESSES}${mode}\n\n${grid}`
}

export function submit({
  game,
  words,
}: {
  game: FiveLettersGame
  words: Words
}): FiveLettersGame {
  if (isOver(game)) {
    return game
  }
  const rejection = rejectionFor({ game, words })
  if (rejection !== null) {
    return { ...game, rejection }
  }
  return {
    ...game,
    guesses: [...game.guesses, game.typing],
    typing: '',
    rejection: null,
  }
}

export function typeLetter({
  game,
  letter,
}: {
  game: FiveLettersGame
  letter: string
}): FiveLettersGame {
  if (
    isOver(game) ||
    game.typing.length === WORD_LENGTH ||
    !LETTER.test(letter)
  ) {
    return game
  }
  return {
    ...game,
    typing: game.typing + letter.toUpperCase(),
    rejection: null,
  }
}

function count({ word, letter }: { word: string; letter: string }) {
  return [...word].filter((it) => it === letter).length
}

function rejectionFor({
  game,
  words,
}: {
  game: FiveLettersGame
  words: Words
}): Rejection | null {
  if (game.typing.length < WORD_LENGTH) {
    return REJECTION.TOO_SHORT
  }
  if (!words.allowed.has(game.typing)) {
    return REJECTION.NOT_A_WORD
  }
  if (game.hardMode && !usesHints({ game, word: game.typing })) {
    return REJECTION.MUST_USE_HINTS
  }
  return null
}

function usesHints({ game, word }: { game: FiveLettersGame; word: string }) {
  const marks = guessMarks(game)
  return game.guesses.every((guess, row) =>
    marks[row].every((mark, i) => {
      if (mark === MARK.CORRECT) {
        return word[i] === guess[i]
      }
      if (mark === MARK.PRESENT) {
        const needed = [...guess].filter(
          (letter, j) => letter === guess[i] && marks[row][j] !== MARK.ABSENT,
        ).length
        return count({ word, letter: guess[i] }) >= needed
      }
      return true
    }),
  )
}
