import { PILE_KIND } from '@/games/solitaire/engine/solitaire.constants'
import {
  boardOf,
  destinationFor,
} from '@/games/solitaire/engine/solitaire.functions'
import type {
  Selection,
  SolitaireGame,
  SolitaireHint,
} from '@/games/solitaire/engine/solitaire.types'
import {
  canDraw,
  isWon,
} from '@/games/solitaire/engine/solitaireBoard.functions'

export function findHint(game: SolitaireGame): SolitaireHint | null {
  const board = boardOf(game)
  if (isWon(board)) {
    return null
  }
  const options: { selection: Selection; rank: number }[] = [
    ...(board.waste.length > 0
      ? [
          {
            selection: { pile: { kind: PILE_KIND.WASTE, index: 0 }, count: 1 },
            rank: 1,
          },
        ]
      : []),
    ...board.tableau.flatMap((column, index) =>
      column.cards.flatMap((_, start) =>
        start < column.faceUpFrom
          ? []
          : [
              {
                selection: {
                  pile: { kind: PILE_KIND.TABLEAU, index },
                  count: column.cards.length - start,
                },
                rank:
                  start === column.cards.length - 1
                    ? 0
                    : start === column.faceUpFrom && start > 0
                      ? 2
                      : -1,
              },
            ],
      ),
    ),
  ]
  const moves = options
    .map(({ selection, rank }) => {
      const to = destinationFor({ game, board, selection })
      return {
        selection,
        to,
        rank:
          to?.kind === PILE_KIND.FOUNDATION
            ? 3
            : selection.pile.kind === PILE_KIND.TABLEAU &&
                board.tableau[selection.pile.index].faceUpFrom ===
                  board.tableau[selection.pile.index].cards.length -
                    selection.count &&
                board.tableau[selection.pile.index].faceUpFrom > 0
              ? 2
              : rank,
      }
    })
    .filter((move) => move.to !== null && move.rank >= 1)
    .sort((a, b) => b.rank - a.rank)
  if (moves.length > 0) {
    return { selection: moves[0].selection, to: moves[0].to }
  }
  return canDraw(board) ? { selection: null, to: null } : null
}
