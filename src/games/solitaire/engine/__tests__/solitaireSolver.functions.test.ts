import { describe, expect, it } from 'vitest'

import { epochDay } from '@/shared/lib/date.functions'
import {
  BUILD_ORDER,
  DAILY_SEED_SPREAD,
  DRAW_MODE,
  VERDICT,
} from '@/games/solitaire/engine/solitaire.constants'
import { deal } from '@/games/solitaire/engine/solitaireBoard.functions'
import { encodeBoard } from '@/games/solitaire/engine/solitaireCodec.functions'
import {
  solve,
  winnableDeal,
} from '@/games/solitaire/engine/solitaireSolver.functions'

const DAILY_SEED = BigInt(epochDay('2026-10-25')) * DAILY_SEED_SPREAD

describe('winnableDeal', { timeout: 20_000 }, () => {
  it.each([
    [
      DRAW_MODE.DRAW_ONE,
      BUILD_ORDER.DOWN,
      '/TS|JS/9D|9SKD/AC|JH5D3S/6D|KS2H3C4D/JC|7SQDTC9C2S/TD|3D4S4C6C3H8D/2D;8C5CTH6H2C5H4H7HAD6S8HAS7DQHAHKC9H5S8SJDQSKH7CQC;;|||',
    ],
    [
      DRAW_MODE.DRAW_THREE,
      BUILD_ORDER.DOWN,
      '/TH|4S/7D|6S3H/8S|TC9HAS/3D|9S6H3CJC/KH|2SQH5HAHKS/QS|JS4DAD7C7S8D/9C;6CAC5D4C5C2DTSQC3S9DJD6D8C8H5S2HJH2CKCTDKD4H7HQD;;|||',
    ],
    [
      DRAW_MODE.DRAW_ONE,
      BUILD_ORDER.UP,
      '/TH|4S/7D|6S3H/8S|TC9HAS/3D|9S6H3CJC/KH|2SQH5HAHKS/QS|JS4DAD7C7S8D/9C;6CAC5D4C5C2DTSQC3S9DJD6D8C8H5S2HJH2CKCTDKD4H7HQD;;|||',
    ],
  ])('deals the fixed daily %s %s game', (drawMode, order, expected) => {
    const { board } = winnableDeal({ seed: DAILY_SEED, drawMode, order })

    expect(encodeBoard(board)).toBe(expected)
  })
})

describe('solve', () => {
  it.each([
    [4n, VERDICT.WINNABLE],
    [5n, VERDICT.UNWINNABLE],
    [8n, VERDICT.UNKNOWN],
  ])('gives draw 3 deal %i the verdict %s', (seed, verdict) => {
    expect(
      solve({
        start: deal(seed),
        drawMode: DRAW_MODE.DRAW_THREE,
        order: BUILD_ORDER.DOWN,
        budget: 1_000,
      }),
    ).toBe(verdict)
  })
})
