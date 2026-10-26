import { describe, expect, it } from 'vitest'

import { deal } from '@/common/solitaire/solitaireBoard.functions'
import {
  decodeBoard,
  decodeMoves,
  encodeBoard,
  encodeMoves,
} from '@/common/solitaire/solitaireCodec.functions'

const DEAL_1 =
  '/TH|QS/JD|AHAC/2D|8D4HJS/3D|6HAD7HTD/4D|TC8HJHJC9S/5H|7D3H6S8C3S4C/AS;QC2SQD2HQH4STS5SKS9C5D9H6DKDKH5C8S2CKC7S6C3C7C9D;;|||'

describe('deal', () => {
  it('deals the fixed board for a seed', () => {
    expect(encodeBoard(deal(1n))).toBe(DEAL_1)
  })

  it('round-trips a board through its encoding', () => {
    expect(encodeBoard(decodeBoard(DEAL_1))).toBe(DEAL_1)
  })
})

describe('encodeMoves', () => {
  it('round-trips draws and transfers', () => {
    const text = 'D,W01T3,T23F1'

    expect(encodeMoves(decodeMoves(text))).toBe(text)
  })
})
