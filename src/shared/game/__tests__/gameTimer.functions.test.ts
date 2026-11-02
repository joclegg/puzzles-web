import { describe, expect, it } from 'vitest'

import { elapsedAt } from '@/shared/game/gameTimer.functions'

describe('elapsedAt', () => {
  it('returns the accumulated time while paused', () => {
    expect(
      elapsedAt({ clock: { accumulatedMs: 500, since: 0 }, now: 9000 }),
    ).toBe(500)
  })

  it('adds the time since the clock resumed', () => {
    expect(
      elapsedAt({ clock: { accumulatedMs: 500, since: 1000 }, now: 3000 }),
    ).toBe(2500)
  })

  it('never counts backwards from a reading taken before resuming', () => {
    expect(
      elapsedAt({ clock: { accumulatedMs: 500, since: 1000 }, now: 900 }),
    ).toBe(500)
  })
})
