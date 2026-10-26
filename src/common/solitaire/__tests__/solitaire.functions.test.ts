import { describe, expect, it } from 'vitest'

import {
  BUILD_ORDER,
  DRAW_MODE,
  PILE_KIND,
  RANK_CODES,
  SUITS,
} from '@/common/solitaire/solitaire.constants'
import {
  boardOf,
  dropCards,
  gameWon,
  restart,
  tapCard,
  tapEmptyPile,
  tapStock,
  undo,
} from '@/common/solitaire/solitaire.functions'
import type {
  BuildOrder,
  SolitaireGame,
} from '@/common/solitaire/solitaire.types'
import { deal } from '@/common/solitaire/solitaireBoard.functions'
import { decodeBoard } from '@/common/solitaire/solitaireCodec.functions'

function column(index: number) {
  return { kind: PILE_KIND.TABLEAU, index }
}

function state({
  text,
  oneTapMove = true,
  order = BUILD_ORDER.DOWN,
}: {
  text: string
  oneTapMove?: boolean
  order?: BuildOrder
}): SolitaireGame {
  return {
    start: decodeBoard(text),
    drawMode: DRAW_MODE.DRAW_ONE,
    moves: [],
    selection: null,
    oneTapMove,
    order,
  }
}

describe('tapCard', () => {
  it('sends an ace to its foundation', () => {
    const after = tapCard({
      game: state({ text: '/AH|/;;;|||' }),
      pile: column(0),
      index: 0,
    })

    expect(boardOf(after).foundations[2]).toEqual([{ rank: 1, suit: 2 }])
  })

  it('prefers the foundation over a column', () => {
    const after = tapCard({
      game: state({ text: '/2H|/3S;;;||AH|' }),
      pile: column(0),
      index: 0,
    })

    expect(boardOf(after).foundations[2]).toHaveLength(2)
  })

  it('moves a whole run from its first card', () => {
    const after = tapCard({
      game: state({ text: '4C/TH9S|/JC;;;|||' }),
      pile: column(0),
      index: 1,
    })

    expect(boardOf(after)).toEqual(decodeBoard('/4C|/JCTH9S;;;|||'))
  })

  it('sends a king to its foundation when cards build up', () => {
    const game = state({ text: '4C/KH|/;;;|||', order: BUILD_ORDER.UP })

    const after = tapCard({ game, pile: column(0), index: 1 })

    expect(boardOf(after)).toEqual(decodeBoard('/4C|/;;;||KH|'))
  })

  it('keeps a card with nowhere to go selected', () => {
    const after = tapCard({
      game: state({ text: '/5H|/9C;;;|||' }),
      pile: column(0),
      index: 0,
    })

    expect(after.selection).toEqual({ pile: column(0), count: 1 })
  })

  it('moves a card to a tapped target with one tap move off', () => {
    const game = state({ text: '/QH|/KS|/KC;;;|||', oneTapMove: false })

    const after = tapCard({
      game: tapCard({ game, pile: column(0), index: 0 }),
      pile: column(2),
      index: 0,
    })

    expect(boardOf(after)).toEqual(decodeBoard('/|/KS|/KCQH;;;|||'))
  })

  it('does not move a king at the bottom of its column to an empty one', () => {
    const after = tapCard({
      game: state({ text: '/KH|/;;;|||' }),
      pile: column(0),
      index: 0,
    })

    expect(after.moves).toHaveLength(0)
  })

  it('ignores a face down card', () => {
    const after = tapCard({
      game: state({ text: 'AS/KH|/;;;|||' }),
      pile: column(0),
      index: 0,
    })

    expect([after.moves.length, after.selection]).toEqual([0, null])
  })

  it('wins when the last kings go up, and undo does nothing', () => {
    const foundations = SUITS.map((suit) =>
      [...RANK_CODES.slice(0, 12)]
        .map((rank) => `${rank}${suit.code}`)
        .join(''),
    ).join('|')
    const game = state({ text: `/KC|/KD|/KH|/KS;;;${foundations}` })

    const after = [0, 1, 2, 3].reduce(
      (played, index) =>
        tapCard({ game: played, pile: column(index), index: 0 }),
      game,
    )

    expect(gameWon(after)).toBe(true)
    expect(undo(after)).toEqual({ ...after, selection: null })
  })
})

describe('tapEmptyPile', () => {
  it('moves a selected king to an empty column', () => {
    const game = tapCard({
      game: state({ text: 'QD/KH|/;;;|||', oneTapMove: false }),
      pile: column(0),
      index: 1,
    })

    const after = tapEmptyPile({ game, pile: column(1) })

    expect(boardOf(after)).toEqual(decodeBoard('/QD|/KH;;;|||'))
  })
})

describe('undo', () => {
  it('turns a revealed card face down again', () => {
    const game = tapCard({
      game: state({ text: '2D/AH|/;;;|||' }),
      pile: column(0),
      index: 1,
    })

    expect(boardOf(undo(game))).toEqual(decodeBoard('2D/AH|/;;;|||'))
  })

  it.each([1, 5, 30])('takes back %i draws to the deal', (draws) => {
    const start: SolitaireGame = {
      start: deal(3n),
      drawMode: DRAW_MODE.DRAW_THREE,
      moves: [],
      selection: null,
      oneTapMove: true,
      order: BUILD_ORDER.DOWN,
    }
    const played = Array.from({ length: draws }).reduce<SolitaireGame>(
      (game) => tapStock(game),
      start,
    )

    const undone = Array.from({ length: draws }).reduce<SolitaireGame>(
      (game) => undo(game),
      played,
    )

    expect(boardOf(undone)).toEqual(deal(3n))
  })
})

describe('tapStock', () => {
  it('does nothing with an empty stock and waste', () => {
    expect(tapStock(state({ text: '/KS;;;|||' })).moves).toHaveLength(0)
  })
})

describe('restart', () => {
  it('goes back to the deal', () => {
    const game = tapStock(tapStock(state({ text: '/;2C3C;;|||' })))

    const after = restart(game)

    expect([boardOf(after), after.selection]).toEqual([
      decodeBoard('/;2C3C;;|||'),
      null,
    ])
  })
})

describe('dropCards', () => {
  it('moves a run dropped where it fits', () => {
    const after = dropCards({
      game: state({ text: '4C/TH9S|/JC|/KD;;;|||' }),
      from: column(0),
      index: 1,
      to: column(1),
    })

    expect(boardOf(after)).toEqual(decodeBoard('/4C|/JCTH9S|/KD;;;|||'))
  })

  it('moves nothing when dropped where it does not fit', () => {
    const after = dropCards({
      game: state({ text: '4C/TH9S|/JC|/KD;;;|||' }),
      from: column(0),
      index: 1,
      to: column(2),
    })

    expect(after.moves).toHaveLength(0)
  })
})
