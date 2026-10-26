import { SUITS } from '@/common/solitaire/solitaire.constants'
import type { Card } from '@/common/solitaire/solitaire.types'
import { RANK_NAME } from '@/components/PlayingCard/PlayingCard.constants'

export function cardName(card: Card): string {
  return `${RANK_NAME[card.rank]} of ${SUITS[card.suit].name}`
}
