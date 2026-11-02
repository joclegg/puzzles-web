import { MEDAL } from '@/shared/game/dailyMedal.constants'
import { dailyDays } from '@/shared/game/dailyMedal.functions'
import type { DailyResult, Medal } from '@/shared/game/dailyMedal.types'
import { formatDayMonth } from '@/shared/lib/format.functions'
import {
  daily2Date,
  daily2Label,
  dailyResults as fiveLettersResults,
  isDaily,
  isDaily2,
} from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { SIZES as KAKURO_SIZES } from '@/games/kakuro/engine/kakuro.constants'
import { PUZZLE_STATUS_LABEL } from '@/shared/game/puzzleSaves.constants'
import { dailyPuzzleResults } from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { puzzleTitle } from '@/shared/game/puzzleTitle.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { SIZES as SIGHTLINES_SIZES } from '@/games/sightlines/engine/sightlines.constants'
import { LEVELS as SLIDE_OUT_LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import { slideOutTitle } from '@/games/slideOut/engine/slideOutSaves.functions'
import { DEAL_STATUS_LABEL } from '@/games/solitaire/engine/solitaireSaves.constants'
import {
  dailyResults as solitaireResults,
  dealTitle,
} from '@/games/solitaire/engine/solitaireSaves.functions'
import { GAME_MODES, LEVELS } from '@/games/sudoku/engine/sudoku.constants'
import { SUDOKU_STATUS_LABEL } from '@/games/sudoku/engine/sudokuSaves.constants'
import {
  dailyResults as sudokuResults,
  sudokuTitle,
} from '@/games/sudoku/engine/sudokuSaves.functions'
import { SIZES as TWO_TONE_SIZES } from '@/games/twoTone/engine/twoTone.constants'
import { LEVELS as WORD_WHEEL_LEVELS } from '@/games/wordWheel/engine/wordWheel.constants'
import { wordWheelTitle } from '@/games/wordWheel/engine/wordWheelSaves.functions'
import {
  FIVE_LETTERS_STATUS_LABEL,
  GAME_NAME,
} from '@/shared/game/AllGames/AllGames.constants'
import type {
  AllSaves,
  HistoryRow,
} from '@/shared/game/AllGames/AllGames.types'
import type { GameRoute } from '@/shared/lib/route.types'

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
