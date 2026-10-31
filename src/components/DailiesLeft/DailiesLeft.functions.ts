import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import { dailyId } from '@/common/fiveLetters/fiveLettersSaves.functions'
import { SIZES as KAKURO_SIZES } from '@/common/kakuro/kakuro.constants'
import { DAILY_PREFIX, PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import { dailyPuzzleId } from '@/common/puzzleSaves.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { SIZES as SIGHTLINES_SIZES } from '@/common/sightlines/sightlines.constants'
import { LEVELS as SLIDE_OUT_LEVELS } from '@/common/slideOut/slideOut.constants'
import {
  DAILY_PREFIX as SOLITAIRE_DAILY_PREFIX,
  DEAL_STATUS,
} from '@/common/solitaire/solitaireSaves.constants'
import {
  DIFFICULTY_LABEL,
  GAME_MODES,
  LEVELS,
} from '@/common/sudoku/sudoku.constants'
import type { GameMode } from '@/common/sudoku/sudoku.types'
import { bankFile, dailySudokuId } from '@/common/sudoku/sudokuBank.functions'
import { SUDOKU_STATUS } from '@/common/sudoku/sudokuSaves.constants'
import { SIZES as TWO_TONE_SIZES } from '@/common/twoTone/twoTone.constants'
import { LEVELS as WORD_WHEEL_LEVELS } from '@/common/wordWheel/wordWheel.constants'
import type {
  DailyLeft,
  DailySaves,
} from '@/components/DailiesLeft/DailiesLeft.types'
import { TODAY_PLAY } from '@/components/DailiesLeft/DailiesLeft.constants'

export function dailiesLeft({
  today,
  saves,
  route,
  mode,
}: {
  today: string
  saves: DailySaves
  route: DailyLeft['route']
  mode?: GameMode
}): DailyLeft[] {
  const sudokuDone = new Set(
    saves.sudoku
      .filter((game) => game.status === SUDOKU_STATUS.COMPLETED)
      .map((game) => game.puzzleId),
  )
  const solitaireWon = saves.solitaire.some(
    (game) =>
      game.dealId === `${SOLITAIRE_DAILY_PREFIX}${today}` &&
      game.status === DEAL_STATUS.WON,
  )
  const wordDone = saves.fiveLetters.some(
    (game) =>
      game.wordId === dailyId(today) &&
      (game.status === GAME_STATUS.WON || game.status === GAME_STATUS.LOST),
  )
  const all: DailyLeft[] = [
    ...GAME_MODES.filter((each) => mode === undefined || each === mode).flatMap(
      (each) =>
        LEVELS[each]
          .filter(
            (difficulty) =>
              !sudokuDone.has(
                dailySudokuId({ mode: each, difficulty, date: today }),
              ),
          )
          .map((difficulty) => ({
            route: GAME_ROUTE.SUDOKU,
            play: bankFile({ mode: each, difficulty }),
            label: DIFFICULTY_LABEL[difficulty],
          })),
    ),
    ...(solitaireWon
      ? []
      : [
          {
            route: GAME_ROUTE.SOLITAIRE,
            play: TODAY_PLAY,
            label: 'Deal',
          },
        ]),
    ...unsolvedSizes({
      games: saves.twoTone,
      sizes: TWO_TONE_SIZES,
      today,
    }).map((size) => ({
      route: GAME_ROUTE.TWO_TONE,
      play: String(size),
      label: `${size}×${size}`,
    })),
    ...unsolvedSizes({
      games: saves.sightlines,
      sizes: SIGHTLINES_SIZES,
      today,
    }).map((size) => ({
      route: GAME_ROUTE.SIGHTLINES,
      play: String(size),
      label: `${size}×${size}`,
    })),
    ...(wordDone
      ? []
      : [
          {
            route: GAME_ROUTE.FIVE_LETTERS,
            play: TODAY_PLAY,
            label: 'Word',
          },
        ]),
    ...unsolvedSizes({ games: saves.kakuro, sizes: KAKURO_SIZES, today }).map(
      (size) => ({
        route: GAME_ROUTE.KAKURO,
        play: String(size),
        label: `${size}×${size}`,
      }),
    ),
    ...unsolvedLevels({
      games: saves.slideOut,
      levels: SLIDE_OUT_LEVELS,
      today,
    }).map((level) => ({
      route: GAME_ROUTE.SLIDE_OUT,
      play: level,
      label: capitalise(level),
    })),
    ...unsolvedLevels({
      games: saves.wordWheel,
      levels: WORD_WHEEL_LEVELS,
      today,
    }).map((level) => ({
      route: GAME_ROUTE.WORD_WHEEL,
      play: level,
      label: `${capitalise(level)} letters`,
    })),
  ]
  return all.filter((daily) => daily.route === route)
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function solvedPuzzles(games: { puzzleId: string; status: string }[]) {
  return new Set(
    games
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.puzzleId),
  )
}

function unsolvedLevels<T extends string>({
  games,
  levels,
  today,
}: {
  games: { puzzleId: string; status: string }[]
  levels: readonly T[]
  today: string
}): T[] {
  const solved = solvedPuzzles(games)
  return levels.filter(
    (level) => !solved.has(`${DAILY_PREFIX}${today}_${level}`),
  )
}

function unsolvedSizes({
  games,
  sizes,
  today,
}: {
  games: { puzzleId: string; status: string }[]
  sizes: readonly number[]
  today: string
}): number[] {
  const solved = solvedPuzzles(games)
  return sizes.filter(
    (size) => !solved.has(dailyPuzzleId({ date: today, size })),
  )
}
