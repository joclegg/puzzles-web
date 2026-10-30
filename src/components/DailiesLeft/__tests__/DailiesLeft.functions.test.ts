import { describe, expect, it } from 'vitest'

import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import { dailyId } from '@/common/fiveLetters/fiveLettersSaves.functions'
import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import { dailyPuzzleId } from '@/common/puzzleSaves.functions'
import { GAME_ROUTE } from '@/common/route.constants'
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
  it('given nothing played when listing then every game has its own puzzles', () => {
    expect(
      new Set(
        dailiesLeft({ today: TODAY, saves: NONE }).map((daily) => daily.route),
      ),
    ).toEqual(new Set(Object.values(GAME_ROUTE)))
  })

  it('given nothing played when listing then each puzzle has its own label and link', () => {
    const twoTone = dailiesLeft({ today: TODAY, saves: NONE }).filter(
      (daily) => daily.route === GAME_ROUTE.TWO_TONE,
    )

    expect(twoTone.map((daily) => [daily.label, daily.play])).toEqual([
      ['Two Tone 4×4', '4'],
      ['Two Tone 6×6', '6'],
      ['Two Tone 8×8', '8'],
      ['Two Tone 10×10', '10'],
      ['Two Tone 12×12', '12'],
    ])
  })

  it('given one Two Tone daily solved when listing then that size is gone', () => {
    const left = dailiesLeft({
      today: TODAY,
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

    expect(
      left
        .filter((daily) => daily.route === GAME_ROUTE.TWO_TONE)
        .map((daily) => daily.play),
    ).toEqual(['6', '8', '10', '12'])
  })

  it('given the solitaire deal won and the word lost when listing then neither is left', () => {
    const left = dailiesLeft({
      today: TODAY,
      saves: {
        ...NONE,
        solitaire: [
          { dealId: `${DAILY_PREFIX}${TODAY}`, status: DEAL_STATUS.WON },
        ],
        fiveLetters: [{ wordId: dailyId(TODAY), status: GAME_STATUS.LOST }],
      },
    })

    expect(left.map((daily) => daily.route)).not.toContain(GAME_ROUTE.SOLITAIRE)
    expect(left.map((daily) => daily.route)).not.toContain(
      GAME_ROUTE.FIVE_LETTERS,
    )
  })
})
