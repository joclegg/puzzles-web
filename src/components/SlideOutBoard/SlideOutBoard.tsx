import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { cn } from '@/common/utils.functions'
import { EXIT_ROW, SIZE } from '@/common/slideOut/slideOut.constants'
import type { Block, Move } from '@/common/slideOut/slideOut.types'
import {
  blockPosition,
  movedTo,
  slideRange,
} from '@/common/slideOut/slideOutBoard.functions'
import {
  COL_SPAN_CLASS,
  COL_START_CLASS,
  ROW_SPAN_CLASS,
  ROW_START_CLASS,
  SLOTS,
} from '@/components/SlideOutBoard/SlideOutBoard.constants'
import { dragPosition } from '@/components/SlideOutBoard/SlideOutBoard.functions'

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
  const [dragging, setDragging] = useState<Move | null>(null)

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
    setDragging({ block: index, position: blockPosition(blocks[index]) })
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (drag === null) {
      return
    }
    const block = blocks[drag.index]
    const range = slideRange({ blocks, index: drag.index })
    const delta = block.horizontal
      ? event.clientX - drag.startX
      : event.clientY - drag.startY
    setDragging({
      block: drag.index,
      position: dragPosition({
        start: blockPosition(block),
        delta,
        cellSize: cellSize(),
        ...range,
      }),
    })
  }

  function onPointerUp() {
    if (dragging !== null) {
      onSlide(dragging)
    }
    dragRef.current = null
    setDragging(null)
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
      className="relative grid aspect-square w-full max-w-md touch-none grid-cols-6 grid-rows-6 rounded-xl bg-so-board p-1"
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
      {blocks.map((original, index) => {
        const block =
          dragging?.block === index
            ? movedTo({ block: original, position: dragging.position })
            : original
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
            onPointerCancel={() => {
              dragRef.current = null
              setDragging(null)
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
