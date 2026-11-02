import { useLayoutEffect, useRef } from 'react'
import type { PointerEvent } from 'react'

import { cn } from '@/shared/lib/utils.functions'
import { PILE_KIND, SUITS } from '@/games/solitaire/engine/solitaire.constants'
import type {
  Board,
  DrawMode,
  Pile,
  Selection,
} from '@/games/solitaire/engine/solitaire.types'
import { PlayingCard } from '@/games/solitaire/ui/PlayingCard/PlayingCard'
import { cardName } from '@/games/solitaire/ui/PlayingCard/PlayingCard.functions'
import {
  CARD_EASING,
  FACE_DOWN_OFFSET_CLASS,
  FACE_UP_OFFSET_CLASS,
  FINISH_FLIGHT_MS,
  MOVE_MS,
  SNAP_BACK_MS,
} from '@/games/solitaire/ui/SolitaireBoard/SolitaireBoard.constants'
import {
  dragKey,
  isDropPile,
  parseDragKey,
  parsePileKey,
  pileKey,
} from '@/games/solitaire/ui/SolitaireBoard/SolitaireBoard.functions'
import { DRAW_CARDS } from '@/games/solitaire/engine/solitaire.constants'
import type { CardPlace } from '@/games/solitaire/ui/SolitaireBoard/SolitaireBoard.types'

export function SolitaireBoard({
  board,
  drawMode,
  selection,
  onStock,
  onCard,
  onEmpty,
  onDrop,
  finishing = false,
}: {
  board: Board
  drawMode: DrawMode
  selection: Selection | null
  finishing?: boolean
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
  const tableRef = useRef<HTMLDivElement>(null)
  const placesRef = useRef(new Map<string, CardPlace>())

  useLayoutEffect(() => {
    const table = tableRef.current
    if (table === null) {
      return
    }
    placesRef.current = animateCards({
      table,
      before: placesRef.current,
      finishing,
    })
  })
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
    const target = drag.moved
      ? document
          .elementsFromPoint(event.clientX, event.clientY)
          .map((element) => element.closest<HTMLElement>('[data-pile]'))
          .find((element) => element?.dataset.pile !== undefined)?.dataset.pile
      : undefined
    const table = tableRef.current
    for (const element of drag.moving) {
      if (drag.moved && table !== null) {
        rememberDropPlace({ table, element, places: placesRef.current })
      }
      element.style.transform = ''
      element.style.zIndex = ''
      element.style.pointerEvents = ''
      if (drag.moved) {
        element.animate(
          [
            {
              transform: `translate(${event.clientX - drag.startX}px, ${event.clientY - drag.startY}px)`,
              zIndex: 50,
            },
            { transform: 'none', zIndex: 50 },
          ],
          { duration: SNAP_BACK_MS, easing: CARD_EASING },
        )
      }
    }
    if (!drag.moved) {
      return
    }
    justDraggedRef.current = true
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
      ref={tableRef}
      className="@container flex w-full max-w-xl flex-col gap-3 rounded-xl bg-sol-felt p-2 sm:p-3 lg:max-w-4xl"
    >
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        <button
          type="button"
          data-stock
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

function animateCards({
  table,
  before,
  finishing,
}: {
  table: HTMLElement
  before: Map<string, CardPlace>
  finishing: boolean
}): Map<string, CardPlace> {
  const origin = table.getBoundingClientRect()
  const stock = table.querySelector<HTMLElement>('[data-stock]')
  const stockRect = stock?.getBoundingClientRect()
  const after = new Map<string, CardPlace>()
  for (const card of table.querySelectorAll<HTMLElement>('[data-card]')) {
    const key = card.dataset.card ?? ''
    const rect = card.getBoundingClientRect()
    const place = {
      x: rect.left - origin.left,
      y: rect.top - origin.top,
      faceUp: card.dataset.faceUp === 'true',
    }
    after.set(key, place)
    const from =
      before.get(key) ??
      (stockRect === undefined ||
      before.size === 0 ||
      card.closest('[aria-label="Waste"]') === null
        ? undefined
        : {
            x: stockRect.left - origin.left,
            y: stockRect.top - origin.top,
            faceUp: false,
          })
    if (from === undefined) {
      continue
    }
    const dx = from.x - place.x
    const dy = from.y - place.y
    const flipped = !from.faceUp && place.faceUp
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !flipped) {
      continue
    }
    for (const running of card.getAnimations()) {
      running.cancel()
    }
    card.animate(
      finishing
        ? [
            { transform: `translate(${dx}px, ${dy}px)`, zIndex: 40 },
            {
              transform: `translate(${dx / 2}px, ${dy / 2 - 40}px) scale(1.25) rotate(-12deg)`,
              zIndex: 40,
              offset: 0.5,
            },
            { transform: 'none', zIndex: 40 },
          ]
        : [
            {
              transform: `translate(${dx}px, ${dy}px)${flipped ? ' rotateY(90deg)' : ''}`,
              zIndex: 40,
            },
            { transform: 'none', zIndex: 40 },
          ],
      {
        duration: finishing ? FINISH_FLIGHT_MS : MOVE_MS,
        easing: CARD_EASING,
      },
    )
  }
  return after
}

function rememberDropPlace({
  table,
  element,
  places,
}: {
  table: HTMLElement
  element: HTMLElement
  places: Map<string, CardPlace>
}) {
  const card = element.matches('[data-card]')
    ? element
    : element.querySelector<HTMLElement>('[data-card]')
  const key = card?.dataset.card
  if (card === null || key === undefined) {
    return
  }
  const origin = table.getBoundingClientRect()
  const rect = card.getBoundingClientRect()
  places.set(key, {
    x: rect.left - origin.left,
    y: rect.top - origin.top,
    faceUp: true,
  })
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
