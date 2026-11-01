export interface Random {
  nextInt: () => number
  nextIntBelow: (until: number) => number
  nextIntBetween: (range: { from: number; until: number }) => number
  nextLong: () => bigint
  nextDouble: () => number
  nextBoolean: () => boolean
}
