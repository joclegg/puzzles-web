import { describe, expect, it } from 'vitest'

import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import { dailyId } from '@/common/fiveLetters/fiveLettersSaves.functions'
import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import { dailyPuzzleId } from '@/common/puzzleSaves.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { DIFFICULTY, GAME_MODE } from '@/common/sudoku/sudoku.constants'
import { dailySudokuId } from '@/common/sudoku/sudokuBank.functions'
import { SUDOKU_STATUS } from '@/common/sudoku/sudokuSaves.constants'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
} from '@/common/solitaire/solitaireSaves.constants'
import { dailiesLeft } from '@/components/DailiesLeft/DailiesLeft.functions'
import type { DailySaves } from '@/components/DailiesLeft/DailiesLeft.types'

const TODAY = '2026-10-30'

const NONE: DailySaves = {
  twoTone: [],
  sightlines: [],
  kakuro: [],
  slideOut: [],
  wordWheel: [],
  sudoku: [],
  solitaire: [],
  fiveLetters: [],
}

describe('dailiesLeft', () => {
  it('given nothing played when listing a game then only that game is listed', () => {
    const left = dailiesLeft({
      today: TODAY,
      saves: NONE,
      route: GAME_ROUTE.TWO_TONE,
    })

    expect(left.map((daily) => [daily.label, daily.play])).toEqual([
      ['4×4', '4'],
      ['6×6', '6'],
      ['8×8', '8'],
      ['10×10', '10'],
      ['12×12', '12'],
    ])
  })

  it('given one Two Tone daily solved when listing then that size is gone', () => {
    const left = dailiesLeft({
      today: TODAY,
      route: GAME_ROUTE.TWO_TONE,
      saves: {
        ...NONE,
        twoTone: [
          {
            puzzleId: dailyPuzzleId({ date: TODAY, size: 4 }),
            status: PUZZLE_STATUS.SOLVED,
          },
        ],
      },
    })

    expect(left.map((daily) => daily.play)).toEqual(['6', '8', '10', '12'])
  })

  it('given one sudoku level solved when listing a mode then only that mode’s other levels are left', () => {
    const left = dailiesLeft({
      today: TODAY,
      route: GAME_ROUTE.SUDOKU,
      mode: GAME_MODE.CLASSIC,
      saves: {
        ...NONE,
        sudoku: [
          {
            puzzleId: dailySudokuId({
              mode: GAME_MODE.CLASSIC,
              difficulty: DIFFICULTY.HARD,
              date: TODAY,
            }),
            status: SUDOKU_STATUS.COMPLETED,
          },
        ],
      },
    })

    expect(left.map((daily) => daily.play)).toEqual([
      'classic_fast',
      'classic_easy',
      'classic_medium',
      'classic_expert',
    ])
  })

  it('given the solitaire deal won when listing then it is not left', () => {
    expect(
      dailiesLeft({
        today: TODAY,
        route: GAME_ROUTE.SOLITAIRE,
        saves: {
          ...NONE,
          solitaire: [
            { dealId: `${DAILY_PREFIX}${TODAY}`, status: DEAL_STATUS.WON },
          ],
        },
      }),
    ).toEqual([])
  })

  it('given the word lost when listing then it is not left', () => {
    expect(
      dailiesLeft({
        today: TODAY,
        route: GAME_ROUTE.FIVE_LETTERS,
        saves: {
          ...NONE,
          fiveLetters: [{ wordId: dailyId(TODAY), status: GAME_STATUS.LOST }],
        },
      }),
    ).toEqual([])
  })
})
