import { cn } from '@/common/utils.functions'
import { PILE_KIND, SUITS } from '@/common/solitaire/solitaire.constants'
import type {
  Board,
  DrawMode,
  Pile,
  Selection,
} from '@/common/solitaire/solitaire.types'
import { PlayingCard } from '@/components/PlayingCard/PlayingCard'
import { cardName } from '@/components/PlayingCard/PlayingCard.functions'
import {
  FACE_DOWN_OFFSET_CLASS,
  FACE_UP_OFFSET_CLASS,
} from '@/components/SolitaireTable/SolitaireTable.constants'
import { DRAW_CARDS } from '@/common/solitaire/solitaire.constants'

export function SolitaireTable({
  board,
  drawMode,
  selection,
  onStock,
  onCard,
  onEmpty,
}: {
  board: Board
  drawMode: DrawMode
  selection: Selection | null
  onStock: () => void
  onCard: (target: { pile: Pile; index: number }) => void
  onEmpty: (pile: Pile) => void
}) {
  const shownWaste = board.waste.slice(-DRAW_CARDS[drawMode])

  function isSelected({ pile, index }: { pile: Pile; index: number }) {
    if (
      selection === null ||
      selection.pile.kind !== pile.kind ||
      selection.pile.index !== pile.index
    ) {
      return false
    }
    const size =
      pile.kind === PILE_KIND.TABLEAU
        ? board.tableau[pile.index].cards.length
        : 0
    return pile.kind === PILE_KIND.TABLEAU
      ? index >= size - selection.count
      : true
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-xl bg-sol-felt p-2 sm:p-3">
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        <button
          type="button"
          aria-label={
            board.stock.length > 0
              ? `Stock, ${board.stock.length} cards`
              : 'Stock, empty: turn the waste over'
          }
          onClick={onStock}
          className={cn(
            'aspect-[5/7] rounded-md',
            board.stock.length > 0
              ? 'border border-sol-card-edge bg-sol-card-back bg-[repeating-linear-gradient(45deg,transparent_0_4px,var(--sol-card-back-pattern)_4px_5px)]'
              : 'bg-sol-empty-pile text-sol-on-felt',
          )}
        >
          {board.stock.length === 0 && '↻'}
        </button>
        <div className="col-span-2 flex" aria-label="Waste" role="group">
          {shownWaste.length === 0 && (
            <span className="aspect-[5/7] w-1/2 rounded-md bg-sol-empty-pile" />
          )}
          {shownWaste.map((card, i) => {
            const top = i === shownWaste.length - 1
            return (
              <div
                key={`${card.rank}-${card.suit}`}
                className={cn('w-1/2', i > 0 && '-ml-[30%]')}
              >
                <PlayingCard
                  card={card}
                  faceUp
                  selected={
                    top &&
                    isSelected({
                      pile: { kind: PILE_KIND.WASTE, index: 0 },
                      index: 0,
                    })
                  }
                  label={top ? `Waste, ${cardName(card)}` : cardName(card)}
                  onTap={() =>
                    top &&
                    onCard({
                      pile: { kind: PILE_KIND.WASTE, index: 0 },
                      index: board.waste.length - 1,
                    })
                  }
                />
              </div>
            )
          })}
        </div>
        {board.foundations.map((pile, index) => {
          const target: Pile = { kind: PILE_KIND.FOUNDATION, index }
          const top = pile.at(-1)
          return top === undefined ? (
            <button
              key={index}
              type="button"
              aria-label={`Foundation ${SUITS[index].name}, empty`}
              onClick={() => onEmpty(target)}
              className="flex aspect-[5/7] items-center justify-center rounded-md bg-sol-empty-pile text-xl text-sol-on-felt"
            >
              {SUITS[index].symbol}
            </button>
          ) : (
            <PlayingCard
              key={index}
              card={top}
              faceUp
              selected={isSelected({ pile: target, index: pile.length - 1 })}
              label={`Foundation ${SUITS[index].name}, ${cardName(top)}`}
              onTap={() => onCard({ pile: target, index: pile.length - 1 })}
            />
          )
        })}
      </div>
      <div className="grid min-h-80 grid-cols-7 items-start gap-1 sm:gap-2">
        {board.tableau.map((column, columnIndex) => {
          const pile: Pile = { kind: PILE_KIND.TABLEAU, index: columnIndex }
          return (
            <div
              key={columnIndex}
              role="group"
              aria-label={`Column ${columnIndex + 1}`}
              className="flex flex-col"
            >
              {column.cards.length === 0 && (
                <button
                  type="button"
                  aria-label={`Column ${columnIndex + 1}, empty`}
                  onClick={() => onEmpty(pile)}
                  className="aspect-[5/7] rounded-md bg-sol-empty-pile"
                />
              )}
              {column.cards.map((card, index) => {
                const faceUp = index >= column.faceUpFrom
                return (
                  <PlayingCard
                    key={`${card.rank}-${card.suit}`}
                    card={card}
                    faceUp={faceUp}
                    selected={faceUp && isSelected({ pile, index })}
                    label={faceUp ? cardName(card) : 'Face down card'}
                    onTap={() => onCard({ pile, index })}
                    className={cn(
                      index > 0 &&
                        (index > column.faceUpFrom
                          ? FACE_UP_OFFSET_CLASS
                          : FACE_DOWN_OFFSET_CLASS),
                    )}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
