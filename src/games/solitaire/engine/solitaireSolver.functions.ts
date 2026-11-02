import {
  DEAL_BUDGET,
  DEFAULT_BUDGET,
  DRAW_CARDS,
  FOUNDATIONS,
  PILE_KIND,
  SUITS,
  VERDICT,
} from '@/games/solitaire/engine/solitaire.constants'
import type {
  Board,
  BuildOrder,
  DrawMode,
  Pile,
  Verdict,
} from '@/games/solitaire/engine/solitaire.types'
import {
  canDraw,
  canMove,
  cardCode,
  cardsIn,
  deal,
  draw,
  faceUpOf,
  isWon,
  moveCards,
} from '@/games/solitaire/engine/solitaireBoard.functions'

const WASTE: Pile = { kind: PILE_KIND.WASTE, index: 0 }

export function solve({
  start,
  drawMode,
  order,
  budget = DEFAULT_BUDGET,
  quickOnly = false,
  shouldStop = () => false,
}: {
  start: Board
  drawMode: DrawMode
  order: BuildOrder
  budget?: number
  quickOnly?: boolean
  shouldStop?: () => boolean
}): Verdict {
  const quick = search({
    start,
    drawMode,
    order,
    budget,
    thorough: false,
    shouldStop,
  })
  if (quick === VERDICT.WINNABLE || quickOnly) {
    return quick === VERDICT.WINNABLE ? quick : VERDICT.UNKNOWN
  }
  return search({ start, drawMode, order, budget, thorough: true, shouldStop })
}

export function winnableDeal({
  seed,
  drawMode,
  order,
}: {
  seed: bigint
  drawMode: DrawMode
  order: BuildOrder
}): { board: Board; seed: bigint } {
  for (let next = seed; ; next++) {
    const board = deal(next)
    if (
      solve({
        start: board,
        drawMode,
        order,
        budget: DEAL_BUDGET,
        quickOnly: true,
      }) === VERDICT.WINNABLE
    ) {
      return { board, seed: next }
    }
  }
}

function boardKey(board: Board): string {
  let key = ''
  for (const column of board.tableau) {
    key += column.faceUpFrom
    for (const card of column.cards) {
      key += cardCode(card)
    }
    key += '|'
  }
  for (const card of board.stock) {
    key += cardCode(card)
  }
  key += '|'
  for (const card of board.waste) {
    key += cardCode(card)
  }
  key += '|'
  for (const pile of board.foundations) {
    key += pile.length
  }
  return key
}

function columnsOf(board: Board): Pile[] {
  return board.tableau.map((_, index) => ({ kind: PILE_KIND.TABLEAU, index }))
}

function foundationPiles(): Pile[] {
  return Array.from({ length: FOUNDATIONS }, (_, index) => ({
    kind: PILE_KIND.FOUNDATION,
    index,
  }))
}

function freesFoundationCard({
  board,
  column,
  order,
}: {
  board: Board
  column: Pile
  order: BuildOrder
}): boolean {
  return foundationPiles().some((to) =>
    canMove({ board, from: column, count: 1, to, order }),
  )
}

function movesFrom({
  board,
  drawMode,
  order,
  thorough,
}: {
  board: Board
  drawMode: DrawMode
  order: BuildOrder
  thorough: boolean
}): Board[] {
  const foundation: Board[] = []
  const revealing: Board[] = []
  const other: Board[] = []
  const foundations = foundationPiles()
  const columns = columnsOf(board)
  for (const from of [WASTE, ...columns]) {
    for (const to of foundations) {
      if (canMove({ board, from, count: 1, to, order })) {
        foundation.push(moveCards({ board, from, count: 1, to }))
      }
    }
  }
  for (const from of columns) {
    const column = board.tableau[from.index]
    const faceUp = faceUpOf(column).length
    for (let count = 1; count <= faceUp; count++) {
      const reveals = count === faceUp && column.faceUpFrom > 0
      const wholeColumn = count === column.cards.length
      for (const to of columns) {
        if (
          to.index === from.index ||
          !canMove({ board, from, count, to, order })
        ) {
          continue
        }
        if (wholeColumn && board.tableau[to.index].cards.length === 0) {
          continue
        }
        const moved = moveCards({ board, from, count, to })
        if (reveals || wholeColumn) {
          revealing.push(moved)
        } else if (
          thorough ||
          freesFoundationCard({ board: moved, column: from, order })
        ) {
          other.push(moved)
        }
      }
    }
  }
  for (const to of columns) {
    if (canMove({ board, from: WASTE, count: 1, to, order })) {
      other.push(moveCards({ board, from: WASTE, count: 1, to }))
    }
    if (thorough) {
      for (const from of foundations) {
        if (canMove({ board, from, count: 1, to, order })) {
          other.push(moveCards({ board, from, count: 1, to }))
        }
      }
    }
  }
  if (canDraw(board)) {
    other.push(draw({ board, drawMode }))
  }
  return [...foundation, ...revealing, ...other]
}

function safeFoundationMove({
  board,
  drawMode,
  order,
}: {
  board: Board
  drawMode: DrawMode
  order: BuildOrder
}) {
  const tops =
    DRAW_CARDS[drawMode] === 1 ? [WASTE, ...columnsOf(board)] : columnsOf(board)
  for (const from of tops) {
    const card = cardsIn({ board, pile: from }).at(-1)
    if (card === undefined) {
      continue
    }
    const to: Pile = { kind: PILE_KIND.FOUNDATION, index: card.suit }
    if (!canMove({ board, from, count: 1, to, order })) {
      continue
    }
    const placedBefore = board.foundations[card.suit].length
    const opposite = SUITS.flatMap((suit, index) =>
      suit.isRed !== SUITS[card.suit].isRed
        ? [board.foundations[index].length]
        : [],
    )
    if (placedBefore <= 1 || opposite.every((it) => it >= placedBefore)) {
      return moveCards({ board, from, count: 1, to })
    }
  }
  return null
}

function search({
  start,
  drawMode,
  order,
  budget,
  thorough,
  shouldStop,
}: {
  start: Board
  drawMode: DrawMode
  order: BuildOrder
  budget: number
  thorough: boolean
  shouldStop: () => boolean
}): Verdict {
  const seen = new Set<string>()
  const stack = [settle({ start, drawMode, order })]
  let explored = 0
  while (stack.length > 0) {
    const board = stack.pop()!
    if (isWon(board)) {
      return VERDICT.WINNABLE
    }
    const key = boardKey(board)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    explored++
    if (explored > budget || shouldStop()) {
      return VERDICT.UNKNOWN
    }
    const next = movesFrom({ board, drawMode, order, thorough })
    for (let i = next.length - 1; i >= 0; i--) {
      stack.push(settle({ start: next[i], drawMode, order }))
    }
  }
  return VERDICT.UNWINNABLE
}

function settle({
  start,
  drawMode,
  order,
}: {
  start: Board
  drawMode: DrawMode
  order: BuildOrder
}): Board {
  let board = start
  for (;;) {
    const safe = safeFoundationMove({ board, drawMode, order })
    if (safe === null) {
      return board
    }
    board = safe
  }
}
