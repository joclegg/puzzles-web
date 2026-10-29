import { describe, expect, it } from 'vitest'

import { PILE_KIND } from '@/common/solitaire/solitaire.constants'
import { decodeBoard } from '@/common/solitaire/solitaireCodec.functions'
import {
  cardName,
  hintMessage,
} from '@/components/PlayingCard/PlayingCard.functions'

describe('cardName', () => {
  it('names a card for screen readers', () => {
    expect(cardName({ rank: 12, suit: 2 })).toBe('Queen of hearts')
  })
})

describe('hintMessage', () => {
  it('names the card it goes onto and that it turns a card over', () => {
    expect(
      hintMessage({
        board: decodeBoard('AS/7H|/8C;;;|||'),
        selection: { pile: { kind: PILE_KIND.TABLEAU, index: 0 }, count: 1 },
        to: { kind: PILE_KIND.TABLEAU, index: 1 },
      }),
    ).toBe(
      'Move the 7 of hearts onto the 8 of clubs to turn over the card under it.',
    )
  })

  it('names the empty column and explains a waste move', () => {
    expect(
      hintMessage({
        board: decodeBoard('/|/;;KS;|||'),
        selection: { pile: { kind: PILE_KIND.WASTE, index: 0 }, count: 1 },
        to: { kind: PILE_KIND.TABLEAU, index: 1 },
      }),
    ).toBe(
      'Move the King of spades from the waste to the empty column 2, so the card under it can be played.',
    )
  })
})
