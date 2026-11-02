import { useRef } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { cn } from '@/shared/lib/utils.functions'
import { EXIT_ROW, SIZE } from '@/games/slideOut/engine/slideOut.constants'
import type { Block, Move } from '@/games/slideOut/engine/slideOut.types'
import {
  blockPosition,
  slideRange,
} from '@/games/slideOut/engine/slideOutBoard.functions'
import {
  COL_SPAN_CLASS,
  COL_START_CLASS,
  ROW_SPAN_CLASS,
  ROW_START_CLASS,
  SLOTS,
} from '@/games/slideOut/ui/SlideOutBoard/SlideOutBoard.constants'
import {
  dragOffset,
  dragPosition,
} from '@/games/slideOut/ui/SlideOutBoard/SlideOutBoard.functions'

export function SlideOutBoard({
  blocks,
  hint,
  onSlide,
}: {
  blocks: Block[]
  hint: Move | null
  onSlide: (move: Move) => void
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    index: number
    startX: number
    startY: number
  } | null>(null)

  function cellSize() {
    return (boardRef.current?.getBoundingClientRect().width ?? SIZE) / SIZE
  }

  function onPointerDown({
    event,
    index,
  }: {
    event: PointerEvent<HTMLButtonElement>
    index: number
  }) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { index, startX: event.clientX, startY: event.clientY }
  }

  function dragDelta(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (drag === null) {
      return null
    }
    const block = blocks[drag.index]
    return {
      block,
      index: drag.index,
      delta: block.horizontal
        ? event.clientX - drag.startX
        : event.clientY - drag.startY,
      range: slideRange({ blocks, index: drag.index }),
    }
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragDelta(event)
    if (drag === null) {
      return
    }
    const offset = dragOffset({
      start: blockPosition(drag.block),
      delta: drag.delta,
      cellSize: cellSize(),
      ...drag.range,
    })
    event.currentTarget.style.transform = drag.block.horizontal
      ? `translateX(${offset}px)`
      : `translateY(${offset}px)`
  }

  function onPointerUp(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragDelta(event)
    event.currentTarget.style.transform = ''
    dragRef.current = null
    if (drag === null) {
      return
    }
    const position = dragPosition({
      start: blockPosition(drag.block),
      delta: drag.delta,
      cellSize: cellSize(),
      ...drag.range,
    })
    if (position !== blockPosition(drag.block)) {
      onSlide({ block: drag.index, position })
    }
  }

  function onKeyDown({
    event,
    index,
  }: {
    event: KeyboardEvent<HTMLButtonElement>
    index: number
  }) {
    const block = blocks[index]
    const forward = block.horizontal ? 'ArrowRight' : 'ArrowDown'
    const backward = block.horizontal ? 'ArrowLeft' : 'ArrowUp'
    const step = event.key === forward ? 1 : event.key === backward ? -1 : 0
    if (step === 0) {
      return
    }
    event.preventDefault()
    const range = slideRange({ blocks, index })
    const position = blockPosition(block) + step
    if (position >= range.low && position <= range.high) {
      onSlide({ block: index, position })
    }
  }

  return (
    <div
      ref={boardRef}
      role="group"
      aria-label="Board"
      className="relative grid aspect-square w-full max-w-md touch-none grid-cols-6 grid-rows-6 rounded-xl bg-so-board p-1 lg:max-w-[min(100%,calc(100dvh-16rem))]"
    >
      {SLOTS.map((cell) => (
        <span
          key={cell}
          className={cn(
            'm-0.5 rounded-lg bg-so-slot',
            ROW_START_CLASS[Math.floor(cell / SIZE)],
            COL_START_CLASS[cell % SIZE],
          )}
        />
      ))}
      <span
        className={cn(
          'col-start-6 -mr-1 w-1.5 justify-self-end rounded-sm bg-so-exit',
          ROW_START_CLASS[EXIT_ROW],
        )}
      />
      {blocks.map((block, index) => {
        const target = index === 0
        return (
          <button
            key={index}
            type="button"
            aria-label={`${target ? 'Red block' : `Block ${index}`}, ${
              block.horizontal ? 'across' : 'upright'
            }, row ${block.row + 1} column ${block.col + 1}${
              hint?.block === index ? ', hint' : ''
            }`}
            onPointerDown={(event) => onPointerDown({ event, index })}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={(event) => {
              event.currentTarget.style.transform = ''
              dragRef.current = null
            }}
            onKeyDown={(event) => onKeyDown({ event, index })}
            className={cn(
              'z-10 m-0.5 cursor-grab rounded-lg border-b-4 outline-none focus-visible:ring-3 focus-visible:ring-ring',
              ROW_START_CLASS[block.row],
              COL_START_CLASS[block.col],
              block.horizontal
                ? COL_SPAN_CLASS[block.length]
                : ROW_SPAN_CLASS[block.length],
              target
                ? 'border-b-so-target-edge bg-so-target'
                : 'border-b-so-block-edge bg-so-block',
              hint?.block === index && 'ring-3 ring-so-hint',
            )}
          />
        )
      })}
    </div>
  )
}
