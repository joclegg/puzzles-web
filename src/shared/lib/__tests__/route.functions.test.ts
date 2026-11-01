import { describe, expect, it } from 'vitest'

import { parseHash, routeHash } from '@/shared/lib/route.functions'

describe('parseHash', () => {
  it('splits the hash into path segments', () => {
    expect(parseHash('#/five-letters/game/3')).toEqual([
      'five-letters',
      'game',
      '3',
    ])
  })

  it('reads an empty hash as the launcher', () => {
    expect(parseHash('')).toEqual([])
  })
})

describe('routeHash', () => {
  it('joins segments and drops empty ones', () => {
    expect(routeHash(['five-letters', '', 7])).toBe('#/five-letters/7')
  })
})
