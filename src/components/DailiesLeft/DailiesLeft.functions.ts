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
  const all: DailyLeft[] = [
    {
      route: GAME_ROUTE.SUDOKU,
      label: 'Sudoku',
      accent: MENU_ACCENT.SUDOKU,
      left: GAME_MODES.filter(
        (mode) => !sudokuDone.has(dailySudokuId({ mode, date: today })),
      ).length,
    },
    {
      route: GAME_ROUTE.SOLITAIRE,
      label: 'Solitaire',
      accent: MENU_ACCENT.SOLITAIRE,
      left: saves.solitaire.some(
        (game) =>
          game.dealId === `${SOLITAIRE_DAILY_PREFIX}${today}` &&
          game.status === DEAL_STATUS.WON,
      )
        ? 0
        : 1,
    },
    {
      route: GAME_ROUTE.TWO_TONE,
      label: 'Two Tone',
      accent: MENU_ACCENT.TWO_TONE,
      left: sizedLeft({ games: saves.twoTone, sizes: TWO_TONE_SIZES, today }),
    },
    {
      route: GAME_ROUTE.SIGHTLINES,
      label: 'Sightlines',
      accent: MENU_ACCENT.SIGHTLINES,
      left: sizedLeft({
        games: saves.sightlines,
        sizes: SIGHTLINES_SIZES,
        today,
      }),
    },
    {
      route: GAME_ROUTE.FIVE_LETTERS,
      label: 'Five Letters',
      accent: MENU_ACCENT.FIVE_LETTERS,
      left: saves.fiveLetters.some(
        (game) =>
          game.wordId === dailyId(today) &&
          (game.status === GAME_STATUS.WON || game.status === GAME_STATUS.LOST),
      )
        ? 0
        : 1,
    },
    {
      route: GAME_ROUTE.KAKURO,
      label: 'Kakuro',
      accent: MENU_ACCENT.KAKURO,
      left: sizedLeft({ games: saves.kakuro, sizes: KAKURO_SIZES, today }),
    },
    {
      route: GAME_ROUTE.SLIDE_OUT,
      label: 'Slide Out',
      accent: MENU_ACCENT.SLIDE_OUT,
      left: levelledLeft({
        games: saves.slideOut,
        levels: SLIDE_OUT_LEVELS,
        today,
      }),
    },
    {
      route: GAME_ROUTE.WORD_WHEEL,
      label: 'Word Wheel',
      accent: MENU_ACCENT.WORD_WHEEL,
      left: levelledLeft({
        games: saves.wordWheel,
        levels: WORD_WHEEL_LEVELS,
        today,
      }),
    },
  ]
  return all.filter((daily) => daily.left > 0)
}

function levelledLeft({
  games,
  levels,
  today,
}: {
  games: { puzzleId: string; status: string }[]
  levels: readonly string[]
  today: string
}) {
  const solved = solvedPuzzles(games)
  return levels.filter(
    (level) => !solved.has(`${DAILY_PREFIX}${today}_${level}`),
  ).length
}

function sizedLeft({
  games,
  sizes,
  today,
}: {
  games: { puzzleId: string; status: string }[]
  sizes: readonly number[]
  today: string
}) {
  const solved = solvedPuzzles(games)
  return sizes.filter(
    (size) => !solved.has(dailyPuzzleId({ date: today, size })),
  ).length
}

function solvedPuzzles(games: { puzzleId: string; status: string }[]) {
  return new Set(
    games
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.puzzleId),
  )
}
