import { describe, expect, it } from 'vitest'

import { PILE_KIND } from '@/common/solitaire/solitaire.constants'
import {
  dragKey,
  isDropPile,
  parseDragKey,
  parsePileKey,
  pileKey,
} from '@/components/SolitaireTable/SolitaireTable.functions'

describe('drag keys', () => {
  it('round-trips a card in a pile', () => {
    const card = { pile: { kind: PILE_KIND.TABLEAU, index: 3 }, index: 5 }

    expect(parseDragKey(dragKey(card))).toEqual(card)
  })

  it('round-trips a pile', () => {
    const pile = { kind: PILE_KIND.FOUNDATION, index: 2 }

    expect(parsePileKey(pileKey(pile))).toEqual(pile)
  })

  it('only drops on the tableau and foundations', () => {
    expect(
      [PILE_KIND.WASTE, PILE_KIND.FOUNDATION, PILE_KIND.TABLEAU].map((kind) =>
        isDropPile({ kind, index: 0 }),
      ),
    ).toEqual([false, true, true])
  })
})
