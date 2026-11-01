import { createRandom, shuffled } from '@/common/random.functions'
import {
  COLUMNS,
  DECK,
  DRAW_CARDS,
  FOUNDATIONS,
  KING,
  ORDER_RULES,
  PILE_KIND,
  RANK_CODES,
  SUITS,
} from '@/common/solitaire/solitaire.constants'
import type {
  Board,
  BuildOrder,
  Card,
  Column,
  DrawMode,
  Pile,
} from '@/common/solitaire/solitaire.types'

export function canDraw(board: Board): boolean {
  return board.stock.length > 0 || board.waste.length > 0
}

export function canMove({
  board,
  from,
  count,
  to,
  order,
}: {
  board: Board
  from: Pile
  count: number
  to: Pile
  order: BuildOrder
}): boolean {
  if (
    samePile({ a: from, b: to }) ||
    !canPickUp({ board, pile: from, count, order })
  ) {
    return false
  }
  const moving = cardsIn({ board, pile: from }).slice(-count)
  const lead = moving[0]
  if (to.kind === PILE_KIND.WASTE) {
    return false
  }
  if (to.kind === PILE_KIND.FOUNDATION) {
    return (
      count === 1 &&
      lead.suit === to.index &&
      lead.rank ===
        foundationRank({ order, placed: board.foundations[to.index].length })
    )
  }
  const target = board.tableau[to.index].cards.at(-1)
  return target === undefined
    ? lead.rank === ORDER_RULES[order].columnStarter
    : stacksOnTableau({ card: lead, below: target, order })
}

export function canPickUp({
  board,
  pile,
  count,
  order,
}: {
  board: Board
  pile: Pile
  count: number
  order: BuildOrder
}): boolean {
  const cards = cardsIn({ board, pile })
  if (pile.kind !== PILE_KIND.TABLEAU) {
    return count === 1 && cards.length > 0
  }
  const column = board.tableau[pile.index]
  if (count < 1 || count > faceUpOf(column).length) {
    return false
  }
  const run = cards.slice(-count)
  return run.every(
    (card, i) => i === 0 || stacksOnTableau({ card, below: run[i - 1], order }),
  )
}

export function cardCode(card: Card): string {
  return `${RANK_CODES[card.rank - 1]}${SUITS[card.suit].code}`
}

export function cardCount(board: Board): number {
  return (
    board.tableau.reduce((sum, column) => sum + column.cards.length, 0) +
    board.stock.length +
    board.waste.length +
    board.foundations.reduce((sum, pile) => sum + pile.length, 0)
  )
}

export function cardsIn({ board, pile }: { board: Board; pile: Pile }): Card[] {
  if (pile.kind === PILE_KIND.WASTE) {
    return board.waste
  }
  if (pile.kind === PILE_KIND.FOUNDATION) {
    return board.foundations[pile.index]
  }
  return board.tableau[pile.index].cards
}

export function deal(seed: bigint): Board {
  return dealDeck(shuffled({ items: DECK, random: createRandom(seed) }))
}

export function draw({
  board,
  drawMode,
}: {
  board: Board
  drawMode: DrawMode
}) {
  if (board.stock.length === 0) {
    return { ...board, stock: [...board.waste].reverse(), waste: [] }
  }
  const drawn = board.stock.slice(-DRAW_CARDS[drawMode]).reverse()
  return {
    ...board,
    stock: board.stock.slice(0, board.stock.length - drawn.length),
    waste: [...board.waste, ...drawn],
  }
}

export function faceUpOf(column: Column): Card[] {
  return column.cards.slice(column.faceUpFrom)
}

export function isWon(board: Board): boolean {
  return board.foundations.every((pile) => pile.length === KING)
}

export function moveCards({
  board,
  from,
  count,
  to,
}: {
  board: Board
  from: Pile
  count: number
  to: Pile
}): Board {
  const moving = cardsIn({ board, pile: from }).slice(-count)
  return addCards({
    board: removeCards({ board, pile: from, count }),
    pile: to,
    cards: moving,
  })
}

export function newColumn({
  cards,
  faceUpFrom = Math.max(cards.length - 1, 0),
}: {
  cards: Card[]
  faceUpFrom?: number
}): Column {
  return { cards, faceUpFrom }
}

export function parseCard(code: string): Card {
  return {
    rank: RANK_CODES.indexOf(code[0]) + 1,
    suit: SUITS.findIndex((suit) => suit.code === code[1]),
  }
}

export function samePile({ a, b }: { a: Pile; b: Pile }): boolean {
  return a.kind === b.kind && a.index === b.index
}

function addCards({
  board,
  pile,
  cards,
}: {
  board: Board
  pile: Pile
  cards: Card[]
}) {
  if (pile.kind === PILE_KIND.WASTE) {
    return { ...board, waste: [...board.waste, ...cards] }
  }
  if (pile.kind === PILE_KIND.FOUNDATION) {
    return {
      ...board,
      foundations: board.foundations.map((it, i) =>
        i === pile.index ? [...it, ...cards] : it,
      ),
    }
  }
  return {
    ...board,
    tableau: board.tableau.map((column, i) =>
      i === pile.index
        ? {
            cards: [...column.cards, ...cards],
            faceUpFrom: Math.min(column.faceUpFrom, column.cards.length),
          }
        : column,
    ),
  }
}

function dealDeck(deck: Card[]): Board {
  let next = 0
  const tableau = Array.from({ length: COLUMNS }, (_, i) => {
    const cards = deck.slice(next, next + i + 1)
    next += i + 1
    return newColumn({ cards })
  })
  return {
    tableau,
    stock: deck.slice(next),
    waste: [],
    foundations: Array.from({ length: FOUNDATIONS }, () => []),
  }
}

function foundationRank({
  order,
  placed,
}: {
  order: BuildOrder
  placed: number
}) {
  const rules = ORDER_RULES[order]
  return rules.foundationStarter + rules.step * placed
}

function removeCards({
  board,
  pile,
  count,
}: {
  board: Board
  pile: Pile
  count: number
}) {
  if (pile.kind === PILE_KIND.WASTE) {
    return { ...board, waste: board.waste.slice(0, -count) }
  }
  if (pile.kind === PILE_KIND.FOUNDATION) {
    return {
      ...board,
      foundations: board.foundations.map((it, i) =>
        i === pile.index ? it.slice(0, -count) : it,
      ),
    }
  }
  return {
    ...board,
    tableau: board.tableau.map((column, i) => {
      if (i !== pile.index) {
        return column
      }
      const remaining = column.cards.slice(0, column.cards.length - count)
      return {
        cards: remaining,
        faceUpFrom: Math.min(
          column.faceUpFrom,
          Math.max(remaining.length - 1, 0),
        ),
      }
    }),
  }
}

function stacksOnTableau({
  card,
  below,
  order,
}: {
  card: Card
  below: Card
  order: BuildOrder
}): boolean {
  return (
    card.rank + ORDER_RULES[order].step === below.rank &&
    SUITS[card.suit].isRed !== SUITS[below.suit].isRed
  )
}
