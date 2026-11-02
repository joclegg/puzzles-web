import { describe, expect, it } from 'vitest'

import {
  dragOffset,
  dragPosition,
} from '@/games/slideOut/ui/SlideOutBoard/SlideOutBoard.functions'

describe('dragPosition', () => {
  it.each([
    [10, 2],
    [60, 3],
    [-200, 0],
    [400, 4],
  ])('snaps a drag of %i px to position %i', (delta, position) => {
    expect(
      dragPosition({ start: 2, delta, cellSize: 50, low: 0, high: 4 }),
    ).toBe(position)
  })
})

describe('dragOffset', () => {
  it.each([
    [10, 10],
    [-200, -100],
    [400, 100],
  ])(
    'keeps a drag of %i px to %i px inside the free space',
    (delta, offset) => {
      expect(
        dragOffset({ start: 2, delta, cellSize: 50, low: 0, high: 4 }),
      ).toBe(offset)
    },
  )
})
