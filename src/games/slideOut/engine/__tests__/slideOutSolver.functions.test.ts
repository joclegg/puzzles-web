import { describe, expect, it } from 'vitest'

import { decodePuzzle } from '@/games/slideOut/engine/slideOutBoard.functions'
import { shortestPath } from '@/games/slideOut/engine/slideOutSolver.functions'

describe('shortestPath', () => {
  it.each([
    ['beginner', '4;202H,003H,303V,132H,112H,532H,313V,222V,233V'],
    ['easy', '10;202H,023V,322H,152V,302V,522H,132V,312V,422H,042H,342H'],
    [
      'medium',
      '17;202H,013H,123V,442V,152V,432V,412H,232V,242V,132H,503H,353V',
    ],
    [
      'hard',
      '25;202H,003H,142V,442V,422H,032V,052V,302V,222V,502H,332H,112H,252V',
    ],
    [
      'expert',
      '33;202H,002V,013H,052V,042V,242V,442H,232V,222V,252V,432V,542H,113H',
    ],
  ])('solves a %s puzzle in exactly par moves', (_, line) => {
    const puzzle = decodePuzzle(line)

    const path = shortestPath(puzzle.blocks)

    expect([path?.length, path?.at(-1)]).toEqual([
      puzzle.par,
      { block: 0, position: 4 },
    ])
  })

  it('needs no moves when the red block is already out', () => {
    expect(shortestPath(decodePuzzle('0;242H').blocks)).toEqual([])
  })
})
