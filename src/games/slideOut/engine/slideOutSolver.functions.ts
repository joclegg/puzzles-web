import { SIZE } from '@/games/slideOut/engine/slideOut.constants'
import type { Block, Move } from '@/games/slideOut/engine/slideOut.types'
import {
  blockCells,
  blockPosition,
  movedTo,
} from '@/games/slideOut/engine/slideOutBoard.functions'

const BASE = 8

export function shortestPath(start: Block[]): Move[] | null {
  const count = start.length
  const scales = Array.from({ length: count }, (_, i) => BASE ** i)
  const masks = start.map((block) =>
    Array.from({ length: SIZE }, (_, position) =>
      position + block.length > SIZE
        ? null
        : new Set(blockCells(movedTo({ block, position }))),
    ),
  )
  function positionOf({ key, block }: { key: number; block: number }) {
    return Math.floor(key / scales[block]) % BASE
  }
  function isSolved(key: number) {
    return positionOf({ key, block: 0 }) + start[0].length === SIZE
  }
  function neighbours(key: number): number[] {
    const taken = new Set<number>()
    for (let i = 0; i < count; i++) {
      for (const cell of masks[i][positionOf({ key, block: i })]!) {
        taken.add(cell)
      }
    }
    const found: number[] = []
    for (let i = 0; i < count; i++) {
      const position = positionOf({ key, block: i })
      const own = masks[i][position]!
      function fits(next: number) {
        const cells = masks[i][next]
        return (
          cells !== null &&
          cells !== undefined &&
          [...cells].every((cell) => own.has(cell) || !taken.has(cell))
        )
      }
      const cleared = key - position * scales[i]
      for (let lower = position - 1; lower >= 0 && fits(lower); lower--) {
        found.push(cleared + lower * scales[i])
      }
      for (
        let higher = position + 1;
        higher + start[i].length <= SIZE && fits(higher);
        higher++
      ) {
        found.push(cleared + higher * scales[i])
      }
    }
    return found
  }
  const first = start.reduce(
    (key, block, i) => key + blockPosition(block) * scales[i],
    0,
  )
  if (isSolved(first)) {
    return []
  }
  const parent = new Map<number, number>([[first, first]])
  const queue = [first]
  for (let head = 0; head < queue.length; head++) {
    const key = queue[head]
    for (const next of neighbours(key)) {
      if (parent.has(next)) {
        continue
      }
      parent.set(next, key)
      if (isSolved(next)) {
        const moves: Move[] = []
        let at = next
        while (at !== first) {
          const before = parent.get(at)!
          const moved = scales.findIndex(
            (_, block) =>
              positionOf({ key: at, block }) !==
              positionOf({ key: before, block }),
          )
          moves.push({
            block: moved,
            position: positionOf({ key: at, block: moved }),
          })
          at = before
        }
        return moves.reverse()
      }
      queue.push(next)
    }
  }
  return null
}
