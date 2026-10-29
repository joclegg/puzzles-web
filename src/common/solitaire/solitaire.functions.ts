import { DRAW_CARDS, PILE_KIND } from '@/common/solitaire/solitaire.constants'
import type {
  Board,
  Move,
  Pile,
  Selection,
  SolitaireGame,
} from '@/common/solitaire/solitaire.types'
import {
  canDraw,
  canMove,
  canPickUp,
  cardsIn,
  draw,
  isWon,
  moveCards,
  samePile,
} from '@/common/solitaire/solitaireBoard.functions'

export function autoFinish(game: SolitaireGame): SolitaireGame {
  return canAutoFinish(game)
    ? {
        ...game,
        moves: [...game.moves, ...autoFinishMoves(game)],
        selection: null,
      }
    : game
}

export function autoFinishMoves(game: SolitaireGame): Move[] {
  const moves: Move[] = []
  let board = boardOf(game)
  while (!isWon(board)) {
    const move = board.tableau
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => column.cards.length > 0)
      .map(({ column, index }) =>
        transfer({
          from: { kind: PILE_KIND.TABLEAU, index },
          count: 1,
          to: { kind: PILE_KIND.FOUNDATION, index: column.cards.at(-1)!.suit },
        }),
      )
      .find((it) =>
        canMove({
          board,
          from: it.from!,
          count: 1,
          to: it.to!,
          order: game.order,
        }),
      )
    if (move === undefined) {
      return []
    }
    moves.push(move)
    board = moveCards({ board, from: move.from!, count: 1, to: move.to! })
  }
  return moves
}

export function boardOf(game: SolitaireGame): Board {
  return game.moves.reduce(
    (board, move) =>
      move.draw
        ? draw({ board, drawMode: game.drawMode })
        : moveCards({
            board,
            from: move.from!,
            count: move.count,
            to: move.to!,
          }),
    game.start,
  )
}

export function canAutoFinish(game: SolitaireGame): boolean {
  const board = boardOf(game)
  return (
    !isWon(board) &&
    board.stock.length === 0 &&
    board.waste.length === 0 &&
    board.tableau.every((column) => column.faceUpFrom === 0)
  )
}

export function cycledStock(game: SolitaireGame): boolean {
  const lastPlay = game.moves.findLastIndex((move) => !move.draw)
  let board = boardOf({ ...game, moves: game.moves.slice(0, lastPlay + 1) })
  const cards = board.stock.length + board.waste.length
  if (cards === 0) {
    return true
  }
  const perDraw = DRAW_CARDS[game.drawMode]
  if (perDraw === 1) {
    return game.moves.length - 1 - lastPlay >= cards + 1
  }
  let drawsSinceTurnOver: number | null = null
  for (let i = lastPlay + 1; i < game.moves.length; i++) {
    if (drawsSinceTurnOver !== null) {
      drawsSinceTurnOver++
    } else if (board.stock.length === 0) {
      drawsSinceTurnOver = 0
    }
    board = draw({ board, drawMode: game.drawMode })
  }
  return (
    drawsSinceTurnOver !== null &&
    drawsSinceTurnOver >= Math.ceil(cards / perDraw)
  )
}

export function destinationFor({
  game,
  board,
  selection,
}: {
  game: SolitaireGame
  board: Board
  selection: Selection
}): Pile | null {
  const columns: Pile[] = board.tableau.map((_, index) => ({
    kind: PILE_KIND.TABLEAU,
    index,
  }))
  const candidates: Pile[] = [
    ...(selection.count === 1
      ? [
          {
            kind: PILE_KIND.FOUNDATION,
            index: cardsIn({ board, pile: selection.pile }).at(-1)!.suit,
          },
        ]
      : []),
    ...columns.filter((it) => board.tableau[it.index].cards.length > 0),
    ...columns.filter((it) => board.tableau[it.index].cards.length === 0),
  ]
  return (
    candidates.find(
      (to) =>
        canMove({
          board,
          from: selection.pile,
          count: selection.count,
          to,
          order: game.order,
        }) && !isPointless({ board, to, selection }),
    ) ?? null
  )
}

export function dropCards({
  game,
  from,
  index,
  to,
}: {
  game: SolitaireGame
  from: Pile
  index: number
  to: Pile
}): SolitaireGame {
  const board = boardOf(game)
  const count = cardsIn({ board, pile: from }).length - index
  if (
    isWon(board) ||
    samePile({ a: from, b: to }) ||
    !canMove({ board, from, count, to, order: game.order })
  ) {
    return { ...game, selection: null }
  }
  return play({ game, move: transfer({ from, count, to }) })
}

export function gameWon(game: SolitaireGame): boolean {
  return isWon(boardOf(game))
}

export function restart(game: SolitaireGame): SolitaireGame {
  return { ...game, moves: [], selection: null }
}

export function tapCard({
  game,
  pile,
  index,
}: {
  game: SolitaireGame
  pile: Pile
  index: number
}): SolitaireGame {
  const board = boardOf(game)
  if (isWon(board)) {
    return game
  }
  const count = cardsIn({ board, pile }).length - index
  const tapped = { pile, count }
  const current = game.selection
  if (
    current !== null &&
    samePile({ a: current.pile, b: pile }) &&
    current.count === count
  ) {
    return (
      autoMove({ game, board, selection: tapped }) ?? {
        ...game,
        selection: null,
      }
    )
  }
  if (
    current !== null &&
    !samePile({ a: current.pile, b: pile }) &&
    canMove({
      board,
      from: current.pile,
      count: current.count,
      to: pile,
      order: game.order,
    })
  ) {
    return play({
      game,
      move: transfer({ from: current.pile, count: current.count, to: pile }),
    })
  }
  if (!canPickUp({ board, pile, count, order: game.order })) {
    return { ...game, selection: null }
  }
  if (game.oneTapMove) {
    return (
      autoMove({ game, board, selection: tapped }) ?? {
        ...game,
        selection: tapped,
      }
    )
  }
  return { ...game, selection: tapped }
}

export function tapEmptyPile({
  game,
  pile,
}: {
  game: SolitaireGame
  pile: Pile
}) {
  const current = game.selection
  if (current === null) {
    return game
  }
  const board = boardOf(game)
  return canMove({
    board,
    from: current.pile,
    count: current.count,
    to: pile,
    order: game.order,
  })
    ? play({
        game,
        move: transfer({ from: current.pile, count: current.count, to: pile }),
      })
    : { ...game, selection: null }
}

export function tapStock(game: SolitaireGame): SolitaireGame {
  const board = boardOf(game)
  if (isWon(board) || !canDraw(board)) {
    return { ...game, selection: null }
  }
  return play({ game, move: { draw: true, from: null, count: 0, to: null } })
}

export function undo(game: SolitaireGame): SolitaireGame {
  if (game.moves.length === 0 || gameWon(game)) {
    return { ...game, selection: null }
  }
  return { ...game, moves: game.moves.slice(0, -1), selection: null }
}

function autoMove({
  game,
  board,
  selection,
}: {
  game: SolitaireGame
  board: Board
  selection: Selection
}): SolitaireGame | null {
  const to = destinationFor({ game, board, selection })
  return to === null
    ? null
    : play({
        game,
        move: transfer({ from: selection.pile, count: selection.count, to }),
      })
}

function isPointless({
  board,
  to,
  selection,
}: {
  board: Board
  to: Pile
  selection: Selection
}): boolean {
  const from = selection.pile
  return (
    to.kind === PILE_KIND.TABLEAU &&
    board.tableau[to.index].cards.length === 0 &&
    from.kind === PILE_KIND.TABLEAU &&
    board.tableau[from.index].faceUpFrom === 0 &&
    selection.count === board.tableau[from.index].cards.length
  )
}

function play({
  game,
  move,
}: {
  game: SolitaireGame
  move: Move
}): SolitaireGame {
  return { ...game, moves: [...game.moves, move], selection: null }
}

function transfer({
  from,
  count,
  to,
}: {
  from: Pile
  count: number
  to: Pile
}): Move {
  return { draw: false, from, count, to }
}
