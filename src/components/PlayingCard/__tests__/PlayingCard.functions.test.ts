import { describe, expect, it } from 'vitest'

import { cardName } from '@/components/PlayingCard/PlayingCard.functions'

describe('cardName', () => {
  it('names a card for screen readers', () => {
    expect(cardName({ rank: 12, suit: 2 })).toBe('Queen of hearts')
  })
})
