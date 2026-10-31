import type { DailyResult } from '@/common/dailyMedal.types'
import { MAX_GUESSES } from '@/common/fiveLetters/fiveLetters.constants'
import { dayNumber } from '@/common/fiveLetters/fiveLetters.functions'
import {
  DAILY2_PREFIX,
  DAILY_PREFIX,
  GAME_STATUS,
  LEGACY_DAILY2_PREFIX,
  PRACTICE_SLOT,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import type {
  SavedGame,
  WordRef,
  WordStats,
} from '@/common/fiveLetters/fiveLettersSaves.types'

export function daily2Date(wordId: string): string {
  return wordId.slice(wordId.indexOf('_') + 1)
}

export function daily2Id(date: string): string {
  return `${DAILY2_PREFIX}${date}`
}

export function daily2Label(wordId: string): string {
  return `Daily puzzle 2 #${dayNumber(daily2Date(wordId))}`
}

export function dailyId(date: string): string {
  return `${DAILY_PREFIX}${date}`
}

export function dailyResults(games: SavedGame[]): DailyResult[] {
  return games.flatMap((game) =>
    game.status === GAME_STATUS.WON &&
    (isDaily(game.wordId) || isDaily2(game.wordId))
      ? [
          {
            date: daily2Date(game.wordId),
            id: slotOf(game.wordId),
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

export function isDaily2(wordId: string): boolean {
  return (
    wordId.startsWith(DAILY2_PREFIX) || wordId.startsWith(LEGACY_DAILY2_PREFIX)
  )
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
  return isDaily2(wordId)
    ? daily2Id(daily2Date(wordId))
    : isDaily(wordId)
      ? wordId
      : PRACTICE_SLOT
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
