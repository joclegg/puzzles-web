import { MEDAL } from '@/common/dailyMedal.constants'
import { dailyDays } from '@/common/dailyMedal.functions'
import type { DailyResult, Medal } from '@/common/dailyMedal.types'
import { formatDayMonth } from '@/common/format.functions'
import {
  daily2Date,
  daily2Label,
  dailyResults as fiveLettersResults,
  isDaily,
  isDaily2,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import type { SavedGame } from '@/common/fiveLetters/fiveLettersSaves.types'
import { SIZES as KAKURO_SIZES } from '@/common/kakuro/kakuro.constants'
import { PUZZLE_STATUS_LABEL } from '@/common/puzzleSaves.constants'
import { dailyPuzzleResults } from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { puzzleTitle } from '@/common/puzzleTitle.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES as SIGHTLINES_SIZES } from '@/common/sightlines/sightlines.constants'
import { LEVELS as SLIDE_OUT_LEVELS } from '@/common/slideOut/slideOut.constants'
import { slideOutTitle } from '@/common/slideOut/slideOutSaves.functions'
import { DEAL_STATUS_LABEL } from '@/common/solitaire/solitaireSaves.constants'
import {
  dailyResults as solitaireResults,
  dealTitle,
} from '@/common/solitaire/solitaireSaves.functions'
import { GAME_MODES, LEVELS } from '@/common/sudoku/sudoku.constants'
import { SUDOKU_STATUS_LABEL } from '@/common/sudoku/sudokuSaves.constants'
import {
  dailyResults as sudokuResults,
  sudokuTitle,
} from '@/common/sudoku/sudokuSaves.functions'
import { SIZES as TWO_TONE_SIZES } from '@/common/twoTone/twoTone.constants'
import { LEVELS as WORD_WHEEL_LEVELS } from '@/common/wordWheel/wordWheel.constants'
import { wordWheelTitle } from '@/common/wordWheel/wordWheelSaves.functions'
import {
  FIVE_LETTERS_STATUS_LABEL,
  GAME_NAME,
} from '@/components/AllGames/AllGames.constants'
import type {
  AllSaves,
  GameRoute,
  HistoryRow,
} from '@/components/AllGames/AllGames.types'

export function hasAllGolds(medals: Record<GameRoute, Medal>): boolean {
  return Object.values(medals).every((medal) => medal === MEDAL.GOLD)
}

export function historyRows(saves: AllSaves): HistoryRow[] {
  return [
    ...saves.sudoku.map((game) =>
      row({
        route: GAME_ROUTE.SUDOKU,
        game,
        title: sudokuTitle(game),
        detail: `${SUDOKU_STATUS_LABEL[game.status]} · ${game.mistakes} mistakes`,
      }),
    ),
    ...saves.solitaire.map((game) =>
      row({
        route: GAME_ROUTE.SOLITAIRE,
        game,
        title: dealTitle(game),
        detail: `${DEAL_STATUS_LABEL[game.status]} · ${game.moveCount} moves`,
      }),
    ),
    ...puzzleRows({ route: GAME_ROUTE.TWO_TONE, games: saves.twoTone }),
    ...puzzleRows({ route: GAME_ROUTE.SIGHTLINES, games: saves.sightlines }),
    ...saves.fiveLetters.map((game) => ({
      id: game.id,
      route: GAME_ROUTE.FIVE_LETTERS,
      game: GAME_NAME[GAME_ROUTE.FIVE_LETTERS],
      title: fiveLettersTitle(game),
      detail: `${FIVE_LETTERS_STATUS_LABEL[game.status]} · ${game.guesses.length} guesses`,
      elapsedMs: null,
      startedAt: game.startedAt,
    })),
    ...puzzleRows({ route: GAME_ROUTE.KAKURO, games: saves.kakuro }),
    ...puzzleRows({
      route: GAME_ROUTE.SLIDE_OUT,
      games: saves.slideOut,
      title: slideOutTitle,
    }),
    ...puzzleRows({
      route: GAME_ROUTE.WORD_WHEEL,
      games: saves.wordWheel,
      title: wordWheelTitle,
    }),
  ].sort((a, b) => b.startedAt - a.startedAt)
}

export function todayMedals({
  saves,
  today,
  dayOf,
}: {
  saves: AllSaves
  today: string
  dayOf: (ms: number) => string
}): Record<GameRoute, Medal> {
  function medal({
    results,
    total,
    firstMedal,
  }: {
    results: DailyResult[]
    total: number
    firstMedal?: Medal
  }): Medal {
    return (
      dailyDays({ results, total, firstMedal, dayOf }).get(today)?.medal ??
      MEDAL.NONE
    )
  }
  return {
    [GAME_ROUTE.SUDOKU]: medal({
      results: sudokuResults(saves.sudoku),
      total: GAME_MODES.flatMap((mode) => LEVELS[mode]).length,
    }),
    [GAME_ROUTE.SOLITAIRE]: medal({
      results: solitaireResults(saves.solitaire),
      total: 1,
    }),
    [GAME_ROUTE.TWO_TONE]: medal({
      results: dailyPuzzleResults(saves.twoTone),
      total: TWO_TONE_SIZES.length,
    }),
    [GAME_ROUTE.SIGHTLINES]: medal({
      results: dailyPuzzleResults(saves.sightlines),
      total: SIGHTLINES_SIZES.length,
    }),
    [GAME_ROUTE.FIVE_LETTERS]: medal({
      results: fiveLettersResults(saves.fiveLetters),
      total: 2,
      firstMedal: MEDAL.SILVER,
    }),
    [GAME_ROUTE.KAKURO]: medal({
      results: dailyPuzzleResults(saves.kakuro),
      total: KAKURO_SIZES.length,
    }),
    [GAME_ROUTE.SLIDE_OUT]: medal({
      results: dailyPuzzleResults(saves.slideOut),
      total: SLIDE_OUT_LEVELS.length,
    }),
    [GAME_ROUTE.WORD_WHEEL]: medal({
      results: dailyPuzzleResults(saves.wordWheel),
      total: WORD_WHEEL_LEVELS.length,
    }),
  }
}

function fiveLettersTitle(game: SavedGame): string {
  if (isDaily2(game.wordId)) {
    return daily2Label(game.wordId)
  }
  return isDaily(game.wordId)
    ? `Daily · ${formatDayMonth(daily2Date(game.wordId))}`
    : 'Practice'
}

function puzzleRows({
  route,
  games,
  title = puzzleTitle,
}: {
  route: GameRoute
  games: SavedPuzzle[]
  title?: (game: SavedPuzzle) => string
}): HistoryRow[] {
  return games.map((game) =>
    row({
      route,
      game,
      title: title(game),
      detail: `${PUZZLE_STATUS_LABEL[game.status]} · ${game.hints} hints`,
    }),
  )
}

function row({
  route,
  game,
  title,
  detail,
}: {
  route: GameRoute
  game: { id: string; elapsedMs: number; startedAt: number }
  title: string
  detail: string
}): HistoryRow {
  return {
    id: game.id,
    route,
    game: GAME_NAME[route],
    title,
    detail,
    elapsedMs: game.elapsedMs,
    startedAt: game.startedAt,
  }
}
