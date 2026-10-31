import type { DailyResult } from '@/common/dailyMedal.types'
import { daysBetween } from '@/common/date.functions'
import { MAX_GUESSES } from '@/common/fiveLetters/fiveLetters.constants'
import {
  DAILY_PREFIX,
  GAME_STATUS,
  NYT_FIRST_DAY,
  NYT_PREFIX,
  PRACTICE_SLOT,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import type {
  SavedGame,
  WordRef,
  WordStats,
} from '@/common/fiveLetters/fiveLettersSaves.types'

export function dailyId(date: string): string {
  return `${DAILY_PREFIX}${date}`
}

export function dailyResults(games: SavedGame[]): DailyResult[] {
  return games.flatMap((game) =>
    game.status === GAME_STATUS.WON &&
    (isDaily(game.wordId) || isNyt(game.wordId))
      ? [
          {
            date: game.wordId.slice(game.wordId.indexOf('_') + 1),
            id: game.wordId,
            finishedAt: game.finishedAt,
          },
        ]
      : [],
  )
}

export function finishGame({
  games,
  id,
  guesses,
  won,
  now,
}: {
  games: SavedGame[]
  id: string
  guesses: string[]
  won: boolean
  now: number
}): SavedGame[] {
  const status = won ? GAME_STATUS.WON : GAME_STATUS.LOST
  return games.map((game) =>
    game.id === id ? { ...game, guesses, status, finishedAt: now } : game,
  )
}

export function inProgress(games: SavedGame[]): SavedGame[] {
  return games.filter((game) => game.status === GAME_STATUS.IN_PROGRESS)
}

export function isDaily(wordId: string): boolean {
  return wordId.startsWith(DAILY_PREFIX)
}

export function isNyt(wordId: string): boolean {
  return wordId.startsWith(NYT_PREFIX)
}

export function nytId(date: string): string {
  return `${NYT_PREFIX}${date}`
}

export function nytLabel(wordId: string): string {
  const days = daysBetween({
    from: NYT_FIRST_DAY,
    to: wordId.slice(NYT_PREFIX.length),
  })
  return `Wordle ${days.toLocaleString('en-US')}`
}

export function saveGuesses({
  games,
  id,
  guesses,
}: {
  games: SavedGame[]
  id: string
  guesses: string[]
}): SavedGame[] {
  return games.map((game) => (game.id === id ? { ...game, guesses } : game))
}

export function slotOf(wordId: string): string {
  return isDaily(wordId) || isNyt(wordId) ? wordId : PRACTICE_SLOT
}

export function startGame({
  games,
  id,
  ref,
  hardMode,
  now,
}: {
  games: SavedGame[]
  id: string
  ref: WordRef
  hardMode: boolean
  now: number
}): { games: SavedGame[]; game: SavedGame } {
  const slot = slotOf(ref.id)
  const kept = games.map((game) =>
    game.status === GAME_STATUS.IN_PROGRESS && slotOf(game.wordId) === slot
      ? { ...game, status: GAME_STATUS.ABANDONED }
      : game,
  )
  const game: SavedGame = {
    id,
    wordId: ref.id,
    answer: ref.answer,
    guesses: [],
    hardMode,
    status: GAME_STATUS.IN_PROGRESS,
    startedAt: now,
    finishedAt: null,
  }
  return { games: [...kept, game], game }
}

export function statsOf(games: SavedGame[]): WordStats {
  const finished = games
    .filter(
      (game) =>
        game.status === GAME_STATUS.WON || game.status === GAME_STATUS.LOST,
    )
    .sort((a, b) => (a.finishedAt ?? 0) - (b.finishedAt ?? 0))
  const streaks = finished.reduce<number[]>(
    (all, game) => [
      ...all,
      game.status === GAME_STATUS.WON ? (all.at(-1) ?? 0) + 1 : 0,
    ],
    [0],
  )
  const won = finished.filter((game) => game.status === GAME_STATUS.WON)
  return {
    played: finished.length,
    won: won.length,
    currentStreak: streaks.at(-1) ?? 0,
    maxStreak: Math.max(...streaks),
    guessCounts: Array.from(
      { length: MAX_GUESSES },
      (_, i) => won.filter((game) => game.guesses.length === i + 1).length,
    ),
  }
}
