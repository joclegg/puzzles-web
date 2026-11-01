import { PILE_KIND, SUITS } from '@/games/solitaire/engine/solitaire.constants'
import type {
  Board,
  Card,
  Pile,
  Selection,
} from '@/games/solitaire/engine/solitaire.types'
import { cardsIn } from '@/games/solitaire/engine/solitaireBoard.functions'
import { RANK_NAME } from '@/games/solitaire/ui/PlayingCard/PlayingCard.constants'

export function cardName(card: Card): string {
  return `${RANK_NAME[card.rank]} of ${SUITS[card.suit].name}`
}

export function hintMessage({
  board,
  selection,
  to,
}: {
  board: Board
  selection: Selection
  to: Pile
}): string {
  const moving = cardsIn({ board, pile: selection.pile }).at(-selection.count)!
  const name = cardName(moving)
  if (to.kind === PILE_KIND.FOUNDATION) {
    return `Move the ${name} to its foundation.`
  }
  const target = cardsIn({ board, pile: to }).at(-1)
  const where =
    target === undefined
      ? `to the empty column ${to.index + 1}`
      : `onto the ${cardName(target)}`
  if (selection.pile.kind === PILE_KIND.WASTE) {
    return `Move the ${name} from the waste ${where}, so the card under it can be played.`
  }
  const column = board.tableau[selection.pile.index]
  const reveals =
    column.faceUpFrom > 0 &&
    column.cards.length - selection.count === column.faceUpFrom
  return reveals
    ? `Move the ${name} ${where} to turn over the card under it.`
    : `Move the ${name} ${where}.`
}
