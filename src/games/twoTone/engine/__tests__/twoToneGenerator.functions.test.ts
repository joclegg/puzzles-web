import { describe, expect, it } from 'vitest'

import {
  DAILY_SEED_SPREAD,
  SIZES,
} from '@/games/twoTone/engine/twoTone.constants'
import {
  decodePuzzle,
  encodePuzzle,
  generatePuzzle,
} from '@/games/twoTone/engine/twoToneGenerator.functions'
import {
  brokenCells,
  isFull,
} from '@/games/twoTone/engine/twoToneGrid.functions'
import { solveLogically } from '@/games/twoTone/engine/twoToneSolver.functions'
import { epochDay } from '@/shared/lib/date.functions'

const EXPECTED: Record<number, string> = {
  4: '4;B.........BB.R.B;BBRRRBBRRRBBBRRB',
  6: '6;B...RRB.R......R....B..R....BB......;BBRBRRBBRRBRRRBRBBBRBBRRRBRRBBRRBBRB',
  8: '8;....R..RBR......B..B..R....BR..........BR.B.R.......R.R...R...B.;RBBRRBBRBRBRBBRRBRRBBRRBRBRBRBBRBRBRBRRBRRBBRRBBBBRBRBRRRBRRBRBB',
  10: '10;.BB....R.R...R......BB....RR......B.......R.B...R.B.....R.R....RR.R...R..R...R.R.B.......R....R.....;RBBRBBRRBRRRBRBRBBRBBBRBRBRRBRRRBRBRBRBBRBRBBRBBRRBRRBRBRBRBBRBRRBRRBBRBBRBRBRBRBBRBRBRBRRBRRBRRBBRB',
  12: '12;...........B...RR..B..B.........RB.R....B..RR..R..B.B.....B......R......B........B..B.R....B.B.B....R...........R...B.R..BB..B......R.BB.B.B.R.R;BBRRBRBRRBRBRRBRRBRBBRBBBRRBRRBBRBBRBBRBBRBRRBRRRRBRBBRRBRBBRRBBRRBBRRBBBBRRBBRRBBRRBBRRBRRBRBRBRRBBRBBRBRBRBBRBRRBRBRRBRBBRBBRBRBRRRRBBRBRBBRBR',
}

describe('generatePuzzle', { timeout: 10_000 }, () => {
  it.each(SIZES)(
    'makes a %i grid that follows every rule and logic alone solves',
    (size) => {
      const puzzle = generatePuzzle({ size, seed: BigInt(size) })

      expect(brokenCells(puzzle.solution).size).toBe(0)
      expect(isFull(puzzle.solution)).toBe(true)
      expect(solveLogically(puzzle.givens)).toEqual(puzzle.solution)
    },
  )

  it.each(SIZES)('makes the fixed %i grid for its seed', (size) => {
    const puzzle = generatePuzzle({ size, seed: BigInt(size) })

    expect(encodePuzzle(puzzle)).toBe(EXPECTED[size])
  })

  it('makes the fixed daily puzzle for a date', () => {
    const seed = BigInt(epochDay('2026-10-25')) * DAILY_SEED_SPREAD + 6n

    const puzzle = generatePuzzle({ size: 6, seed })

    expect(encodePuzzle(puzzle)).toBe(
      '6;...R....B....R.........BBR.....R..RR;RBRRBBRBBRBRBRRBRBRBRBRBBRBRBRBRBBRR',
    )
  })

  it('round-trips through its encoding', () => {
    const puzzle = generatePuzzle({ size: 6, seed: 1n })

    expect(decodePuzzle(encodePuzzle(puzzle))).toEqual(puzzle)
  })
})
