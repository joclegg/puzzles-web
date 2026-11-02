import type { Reason, Tile } from '@/games/twoTone/engine/twoTone.types'

export const TILE = {
  EMPTY: '.',
  RED: 'R',
  BLUE: 'B',
} as const

export const OTHER_TILE: Record<Tile, Tile> = {
  [TILE.EMPTY]: TILE.EMPTY,
  [TILE.RED]: TILE.BLUE,
  [TILE.BLUE]: TILE.RED,
}

export const NEXT_TILE: Record<Tile, Tile> = {
  [TILE.EMPTY]: TILE.RED,
  [TILE.RED]: TILE.BLUE,
  [TILE.BLUE]: TILE.EMPTY,
}

export const COLOURS: readonly Tile[] = [TILE.RED, TILE.BLUE]

export const SIZES = [4, 6, 8, 10, 12]

export const RUN = 3

export const REASON = {
  PAIR: 'pair',
  GAP: 'gap',
  BALANCE: 'balance',
  UNIQUE: 'unique',
} as const

export const REASON_MESSAGE: Record<Reason, (line: string) => string> = {
  [REASON.PAIR]: (line) =>
    `Two tiles of the same colour sit side by side in this ${line}, so the tile next to them is the other colour.`,
  [REASON.GAP]: (line) =>
    `A gap between two tiles of the same colour in this ${line} must be the other colour.`,
  [REASON.BALANCE]: (line) =>
    `This ${line} already has half its tiles in one colour, so the rest are the other colour.`,
  [REASON.UNIQUE]: (line) =>
    `Filling this ${line} one way would copy another ${line}, so it goes the other way.`,
}

export const HINT_KIND = {
  MISTAKE: 'mistake',
  NEXT: 'next',
} as const

export const DAILY_SEED_SPREAD = 7919n
