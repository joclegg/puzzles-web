import { dailyDays } from '@/shared/game/dailyMedal.functions'
import { MEDAL } from '@/shared/game/dailyMedal.constants'
import {
  dailiesShareText,
  guessChart,
  recordsShareText,
  streakSummary,
} from '@/shared/game/share.functions'
import { TITLE } from '@/games/fiveLetters/engine/fiveLettersWords.constants'
import {
  dayNumber,
  newGame,
  shareText,
} from '@/games/fiveLetters/engine/fiveLetters.functions'
import { GAME_STATUS } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import {
  daily2Id,
  daily2Label,
  dailyId,
  dailyResults,
  slotOf,
  statsOf,
} from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'

export function fiveLettersDailiesShare({
  name,
  games,
  date,
  dayOf,
}: {
  name: string
  games: SavedGame[]
  date: string
  dayOf: (ms: number) => string
}): string {
  const daily = finished({ games, slot: dailyId(date) })
  const daily2 = finished({ games, slot: daily2Id(date) })
  const parts = [
    daily
      ? shareText({
          game: gameOf(daily),
          title: `${TITLE} #${dayNumber(date)}`,
        })
      : 'Puzzles daily ⬛',
    ...(daily2
      ? [shareText({ game: gameOf(daily2), title: daily2Label(daily2.wordId) })]
      : []),
  ]
  return dailiesShareText({
    name,
    date,
    body: parts.join('\n\n'),
    days: dailyDays({
      results: dailyResults(games),
      total: 2,
      firstMedal: MEDAL.SILVER,
      dayOf,
    }),
  })
}

export function fiveLettersRecordsShare({
  name,
  games,
}: {
  name: string
  games: SavedGame[]
}): string {
  const stats = statsOf(games)
  return recordsShareText({
    name,
    lines: [guessChart(stats.guessCounts)],
    summary: streakSummary({
      lead: `${stats.won}/${stats.played} won`,
      current: stats.currentStreak,
      longest: stats.maxStreak,
    }),
  })
}

function finished({ games, slot }: { games: SavedGame[]; slot: string }) {
  return games.findLast(
    (game) =>
      slotOf(game.wordId) === slot &&
      (game.status === GAME_STATUS.WON || game.status === GAME_STATUS.LOST),
  )
}

function gameOf(saved: SavedGame) {
  return newGame({
    answer: saved.answer,
    guesses: saved.guesses,
    hardMode: saved.hardMode,
    revealed: saved.status === GAME_STATUS.LOST,
  })
}
