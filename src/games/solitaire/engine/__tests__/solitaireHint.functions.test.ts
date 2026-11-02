import { describe, expect, it } from 'vitest'

import { PILE_KIND } from '@/games/solitaire/engine/solitaire.constants'
import { findHint } from '@/games/solitaire/engine/solitaireHint.functions'
import { decodeBoard } from '@/games/solitaire/engine/solitaireCodec.functions'

function gameOf(board: string) {
  return {
    start: decodeBoard(board),
    drawMode: 'drawOne' as const,
    moves: [],
    selection: null,
    oneTapMove: true,
    order: 'down' as const,
  }
}

describe('findHint', () => {
  it('sends an ace up first', () => {
    const hint = findHint(gameOf('/AH|/|/|/|/|/|/;;;|||'))

    expect(hint).toEqual({
      selection: { pile: { kind: PILE_KIND.TABLEAU, index: 0 }, count: 1 },
      to: { kind: PILE_KIND.FOUNDATION, index: expect.any(Number) },
    })
  })

  it('suggests drawing when no card can move', () => {
    expect(findHint(gameOf('/|/|/|/|/|/|/;2C;;|||'))).toEqual({
      selection: null,
      to: null,
    })
  })
})
