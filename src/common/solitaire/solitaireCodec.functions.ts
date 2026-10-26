import { PILE_CODE, PILE_KIND } from '@/common/solitaire/solitaire.constants'
import type {
  Board,
  Card,
  Move,
  Pile,
} from '@/common/solitaire/solitaire.types'
import {
  cardCode,
  newColumn,
  parseCard,
} from '@/common/solitaire/solitaireBoard.functions'

export function decodeBoard(text: string): Board {
  const [tableau, stock, waste, foundations] = text.split(';')
  return {
    tableau: tableau.split('|').map((column) => {
      const [hidden, shown] = column.split('/')
      const faceDown = parseCards(hidden)
      return newColumn({
        cards: [...faceDown, ...parseCards(shown)],
        faceUpFrom: faceDown.length,
      })
    }),
    stock: parseCards(stock),
    waste: parseCards(waste),
    foundations: foundations.split('|').map(parseCards),
  }
}

export function decodeMoves(text: string): Move[] {
  return text
    .split(',')
    .filter((it) => it.length > 0)
    .map((code) =>
      code === 'D'
        ? { draw: true, from: null, count: 0, to: null }
        : {
            draw: false,
            from: parsePile(code.slice(0, 2)),
            count: Number(code.slice(2, -2)),
            to: parsePile(code.slice(-2)),
          },
    )
}

export function encodeBoard(board: Board): string {
  return [
    board.tableau
      .map(
        (column) =>
          `${codes(column.cards.slice(0, column.faceUpFrom))}/${codes(column.cards.slice(column.faceUpFrom))}`,
      )
      .join('|'),
    codes(board.stock),
    codes(board.waste),
    board.foundations.map(codes).join('|'),
  ].join(';')
}

export function encodeMoves(moves: Move[]): string {
  return moves
    .map((move) =>
      move.draw
        ? 'D'
        : `${pileCode(move.from!)}${move.count}${pileCode(move.to!)}`,
    )
    .join(',')
}

function codes(cards: Card[]): string {
  return cards.map(cardCode).join('')
}

function parseCards(text: string): Card[] {
  return (text.match(/.{2}/g) ?? []).map(parseCard)
}

function parsePile(code: string): Pile {
  const index = Number(code[1])
  if (code[0] === 'W') {
    return { kind: PILE_KIND.WASTE, index: 0 }
  }
  return {
    kind: code[0] === 'F' ? PILE_KIND.FOUNDATION : PILE_KIND.TABLEAU,
    index,
  }
}

function pileCode(pile: Pile): string {
  return `${PILE_CODE[pile.kind]}${pile.kind === PILE_KIND.WASTE ? 0 : pile.index}`
}
