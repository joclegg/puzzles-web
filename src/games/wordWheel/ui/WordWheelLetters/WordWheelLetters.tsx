import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'

import { cn } from '@/shared/lib/utils.functions'
import {
  LETTER_POINT,
  LETTER_POSITION_CLASS,
} from '@/games/wordWheel/ui/WordWheelLetters/WordWheelLetters.constants'

export function WordWheelLetters({
  wheel,
  chosen,
  onChoose,
  onSwipeEnd,
}: {
  wheel: string
  chosen: number[]
  onChoose: (index: number) => void
  onSwipeEnd: () => void
}) {
  const swipingRef = useRef(false)
  const [swiped, setSwiped] = useState(false)
  const points = LETTER_POINT[wheel.length]

  function letterUnder(event: PointerEvent<HTMLDivElement>): number | null {
    const element = document.elementFromPoint(event.clientX, event.clientY)
    const index = element?.closest('[data-letter]')?.getAttribute('data-letter')
    return index === null || index === undefined ? null : Number(index)
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const index = letterUnder(event)
    if (index === null) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    swipingRef.current = true
    setSwiped(false)
    if (!chosen.includes(index)) {
      onChoose(index)
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!swipingRef.current) {
      return
    }
    const index = letterUnder(event)
    if (index !== null && !chosen.includes(index)) {
      setSwiped(true)
      onChoose(index)
    }
  }

  function onPointerUp() {
    if (swipingRef.current && swiped) {
      onSwipeEnd()
    }
    swipingRef.current = false
    setSwiped(false)
  }

  return (
    <div
      role="group"
      aria-label="Letters"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipingRef.current = false
      }}
      className="relative aspect-square w-[min(100%,18rem,34dvh)] touch-none rounded-full bg-ww-wheel select-none"
    >
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 size-full"
        aria-hidden
      >
        <polyline
          points={chosen
            .map((index) => `${points[index].x},${points[index].y}`)
            .join(' ')}
          fill="none"
          className="stroke-ww-line"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {[...wheel].map((letter, index) => (
        <span
          key={index}
          data-letter={index}
          role="button"
          tabIndex={-1}
          aria-label={`Letter ${letter}`}
          aria-pressed={chosen.includes(index)}
          className={cn(
            'absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl font-bold shadow',
            LETTER_POSITION_CLASS[wheel.length][index],
            chosen.includes(index)
              ? 'bg-ww-chosen text-ww-chosen-text'
              : 'bg-ww-letter text-ww-letter-text',
          )}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
