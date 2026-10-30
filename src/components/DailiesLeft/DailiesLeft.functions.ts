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
import { GAME_MODES } from '@/common/sudoku/sudoku.constants'
import { dailySudokuId } from '@/common/sudoku/sudokuBank.functions'
import { SUDOKU_STATUS } from '@/common/sudoku/sudokuSaves.constants'
import { SIZES as TWO_TONE_SIZES } from '@/common/twoTone/twoTone.constants'
import { LEVELS as WORD_WHEEL_LEVELS } from '@/common/wordWheel/wordWheel.constants'
import type {
  DailyLeft,
  DailySaves,
} from '@/components/DailiesLeft/DailiesLeft.types'
import { TODAY_PLAY } from '@/components/DailiesLeft/DailiesLeft.constants'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function dailiesLeft({
  today,
  saves,
}: {
  today: string
  saves: DailySaves
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
  return [
    ...GAME_MODES.filter(
      (mode) => !sudokuDone.has(dailySudokuId({ mode, date: today })),
    ).map((mode) => ({
      route: GAME_ROUTE.SUDOKU,
      play: mode,
      label: `Sudoku ${capitalise(mode)}`,
      accent: MENU_ACCENT.SUDOKU,
    })),
    ...(solitaireWon
      ? []
      : [
          {
            route: GAME_ROUTE.SOLITAIRE,
            play: TODAY_PLAY,
            label: 'Solitaire',
            accent: MENU_ACCENT.SOLITAIRE,
          },
        ]),
    ...unsolvedSizes({
      games: saves.twoTone,
      sizes: TWO_TONE_SIZES,
      today,
    }).map((size) => ({
      route: GAME_ROUTE.TWO_TONE,
      play: String(size),
      label: `Two Tone ${size}×${size}`,
      accent: MENU_ACCENT.TWO_TONE,
    })),
    ...unsolvedSizes({
      games: saves.sightlines,
      sizes: SIGHTLINES_SIZES,
      today,
    }).map((size) => ({
      route: GAME_ROUTE.SIGHTLINES,
      play: String(size),
      label: `Sightlines ${size}×${size}`,
      accent: MENU_ACCENT.SIGHTLINES,
    })),
    ...(wordDone
      ? []
      : [
          {
            route: GAME_ROUTE.FIVE_LETTERS,
            play: TODAY_PLAY,
            label: 'Five Letters',
            accent: MENU_ACCENT.FIVE_LETTERS,
          },
        ]),
    ...unsolvedSizes({ games: saves.kakuro, sizes: KAKURO_SIZES, today }).map(
      (size) => ({
        route: GAME_ROUTE.KAKURO,
        play: String(size),
        label: `Kakuro ${size}×${size}`,
        accent: MENU_ACCENT.KAKURO,
      }),
    ),
    ...unsolvedLevels({
      games: saves.slideOut,
      levels: SLIDE_OUT_LEVELS,
      today,
    }).map((level) => ({
      route: GAME_ROUTE.SLIDE_OUT,
      play: level,
      label: `Slide Out ${capitalise(level)}`,
      accent: MENU_ACCENT.SLIDE_OUT,
    })),
    ...unsolvedLevels({
      games: saves.wordWheel,
      levels: WORD_WHEEL_LEVELS,
      today,
    }).map((level) => ({
      route: GAME_ROUTE.WORD_WHEEL,
      play: level,
      label: `Word Wheel ${capitalise(level)} letters`,
      accent: MENU_ACCENT.WORD_WHEEL,
    })),
  ]
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
