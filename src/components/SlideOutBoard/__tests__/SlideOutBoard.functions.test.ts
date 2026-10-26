import { describe, expect, it } from 'vitest'

import { dragPosition } from '@/components/SlideOutBoard/SlideOutBoard.functions'

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
