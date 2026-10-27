import { describe, expect, it } from 'vitest'

import { withDefaults } from '@/common/storage.functions'

describe('withDefaults', () => {
  it('fills settings saved before a new one was added', () => {
    expect(
      withDefaults({
        stored: { showTimer: false } as Record<string, boolean>,
        fallback: { showTimer: true, showHints: true },
      }),
    ).toEqual({ showTimer: false, showHints: true })
  })

  it('keeps saved lists as they are', () => {
    expect(withDefaults({ stored: [1, 2], fallback: [] as number[] })).toEqual([
      1, 2,
    ])
  })
})
