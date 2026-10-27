import { useRef } from 'react'
import type { PointerEvent } from 'react'

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
import {
  dragKey,
  isDropPile,
  parseDragKey,
  parsePileKey,
  pileKey,
} from '@/components/SolitaireTable/SolitaireTable.functions'
import { DRAW_CARDS } from '@/common/solitaire/solitaire.constants'

export function SolitaireTable({
  board,
  drawMode,
  selection,
  onStock,
  onCard,
  onEmpty,
  onDrop,
}: {
  board: Board
  drawMode: DrawMode
  selection: Selection | null
  onStock: () => void
  onCard: (target: { pile: Pile; index: number }) => void
  onEmpty: (pile: Pile) => void
  onDrop: (move: { from: Pile; index: number; to: Pile }) => void
}) {
  const dragRef = useRef<{
    key: string
    startX: number
    startY: number
    moving: HTMLElement[]
    moved: boolean
  } | null>(null)
  const justDraggedRef = useRef(false)
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

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-drag]',
    )
    const key = card?.dataset.drag
    if (!card || key === undefined) {
      return
    }
    const slot = card.parentElement
    const moving =
      parseDragKey(key).pile.kind === PILE_KIND.TABLEAU
        ? siblingsFrom(card)
        : [slot?.dataset.cardSlot !== undefined ? slot : card]
    dragRef.current = {
      key,
      startX: event.clientX,
      startY: event.clientY,
      moving,
      moved: false,
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (drag === null) {
      return
    }
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) < 8) {
      return
    }
    if (!drag.moved) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    drag.moved = true
    for (const element of drag.moving) {
      element.style.transform = `translate(${dx}px, ${dy}px)`
      element.style.zIndex = '50'
      element.style.pointerEvents = 'none'
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    dragRef.current = null
    if (drag === null) {
      return
    }
    for (const element of drag.moving) {
      element.style.transform = ''
      element.style.zIndex = ''
      element.style.pointerEvents = ''
    }
    if (!drag.moved) {
      return
    }
    justDraggedRef.current = true
    const target = document
      .elementsFromPoint(event.clientX, event.clientY)
      .map((element) => element.closest<HTMLElement>('[data-pile]'))
      .find((element) => element?.dataset.pile !== undefined)?.dataset.pile
    if (target === undefined) {
      return
    }
    const to = parsePileKey(target)
    const { pile: from, index } = parseDragKey(drag.key)
    if (isDropPile(to)) {
      onDrop({ from, index, to })
    }
  }

  function onClickCapture(event: { stopPropagation: () => void }) {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      event.stopPropagation()
    }
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      className="@container flex w-full max-w-xl flex-col gap-3 rounded-xl bg-sol-felt p-2 sm:p-3 lg:max-w-4xl"
    >
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
                data-card-slot="waste"
                className={cn('relative w-1/2', i > 0 && '-ml-[30%]')}
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
                  dragId={
                    top
                      ? dragKey({
                          pile: { kind: PILE_KIND.WASTE, index: 0 },
                          index: board.waste.length - 1,
                        })
                      : undefined
                  }
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
          return (
            <div key={index} data-pile={pileKey(target)}>
              {top === undefined ? (
                <button
                  type="button"
                  aria-label={`Foundation ${SUITS[index].name}, empty`}
                  onClick={() => onEmpty(target)}
                  className="flex aspect-[5/7] w-full items-center justify-center rounded-md bg-sol-empty-pile text-xl text-sol-on-felt"
                >
                  {SUITS[index].symbol}
                </button>
              ) : (
                <PlayingCard
                  card={top}
                  faceUp
                  selected={isSelected({
                    pile: target,
                    index: pile.length - 1,
                  })}
                  label={`Foundation ${SUITS[index].name}, ${cardName(top)}`}
                  dragId={dragKey({ pile: target, index: pile.length - 1 })}
                  onTap={() => onCard({ pile: target, index: pile.length - 1 })}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="grid min-h-[112cqw] grid-cols-7 items-start gap-1 sm:gap-2">
        {board.tableau.map((column, columnIndex) => {
          const pile: Pile = { kind: PILE_KIND.TABLEAU, index: columnIndex }
          return (
            <div
              key={columnIndex}
              role="group"
              aria-label={`Column ${columnIndex + 1}`}
              data-pile={pileKey(pile)}
              className="flex min-h-full flex-col"
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
                    dragId={faceUp ? dragKey({ pile, index }) : undefined}
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

function siblingsFrom(card: HTMLElement): HTMLElement[] {
  const siblings: HTMLElement[] = []
  for (
    let element: Element | null = card;
    element !== null;
    element = element.nextElementSibling
  ) {
    siblings.push(element as HTMLElement)
  }
  return siblings
}
