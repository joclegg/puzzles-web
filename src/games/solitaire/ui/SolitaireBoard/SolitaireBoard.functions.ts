import { PILE_KIND } from '@/games/solitaire/engine/solitaire.constants'
import type { Pile, PileKind } from '@/games/solitaire/engine/solitaire.types'

export function dragKey({ pile, index }: { pile: Pile; index: number }) {
  return `${pileKey(pile)}:${index}`
}

export function isDropPile(pile: Pile) {
  return pile.kind !== PILE_KIND.WASTE
}

export function parseDragKey(key: string): { pile: Pile; index: number } {
  const [kind, pileIndex, index] = key.split(':')
  return {
    pile: { kind: kind as PileKind, index: Number(pileIndex) },
    index: Number(index),
  }
}

export function parsePileKey(key: string): Pile {
  const [kind, index] = key.split(':')
  return { kind: kind as PileKind, index: Number(index) }
}

export function pileKey(pile: Pile) {
  return `${pile.kind}:${pile.index}`
}
