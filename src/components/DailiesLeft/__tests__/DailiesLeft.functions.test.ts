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
  it('given nothing played when counting then lists every game', () => {
    expect(
      dailiesLeft({ today: TODAY, saves: NONE }).map((daily) => daily.route),
    ).toEqual(Object.values(GAME_ROUTE))
  })

  it('given one Two Tone daily solved when counting then that size no longer counts', () => {
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
      left.find((daily) => daily.route === GAME_ROUTE.TWO_TONE)?.left,
    ).toBe(4)
  })

  it('given the solitaire deal won and the word lost when counting then neither is left', () => {
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
