import { SIZE } from '@/common/slideOut/slideOut.constants'
import type { Block, Move, Puzzle } from '@/common/slideOut/slideOut.types'

export function blockCells(block: Block): number[] {
  return Array.from({ length: block.length }, (_, step) =>
    block.horizontal
      ? block.row * SIZE + block.col + step
      : (block.row + step) * SIZE + block.col,
  )
}

export function blockPosition(block: Block): number {
  return block.horizontal ? block.col : block.row
}

export function decodeMoves(text: string): Move[] {
  return text
    .split(',')
    .filter((it) => it.length > 0)
    .map((it) => {
      const [block, position] = it.split(':').map(Number)
      return { block, position }
    })
}

export function decodePuzzle(text: string): Puzzle {
  const [par, board] = text.split(';')
  return {
    par: Number(par),
    blocks: board.split(',').map((code) => ({
      row: Number(code[0]),
      col: Number(code[1]),
      length: Number(code[2]),
      horizontal: code[3] === 'H',
    })),
  }
}

export function encodeMoves(moves: Move[]): string {
  return moves.map((move) => `${move.block}:${move.position}`).join(',')
}

export function isBoardSolved(blocks: Block[]): boolean {
  const target = blocks[0]
  return target.col + target.length === SIZE
}

export function moveBlock({
  blocks,
  index,
  position,
}: {
  blocks: Block[]
  index: number
  position: number
}): Block[] {
  return blocks.map((block, i) =>
    i === index ? movedTo({ block, position }) : block,
  )
}

export function movedTo({
  block,
  position,
}: {
  block: Block
  position: number
}) {
  return block.horizontal
    ? { ...block, col: position }
    : { ...block, row: position }
}

export function slideRange({
  blocks,
  index,
}: {
  blocks: Block[]
  index: number
}) {
  const block = blocks[index]
  const taken = occupied({ blocks, except: index })
  function free(position: number) {
    return (
      position >= 0 &&
      position <= SIZE - block.length &&
      blockCells(movedTo({ block, position })).every((cell) => !taken.has(cell))
    )
  }
  let low = blockPosition(block)
  while (free(low - 1)) {
    low--
  }
  let high = blockPosition(block)
  while (free(high + 1)) {
    high++
  }
  return { low, high }
}

function occupied({
  blocks,
  except,
}: {
  blocks: Block[]
  except?: number
}): Set<number> {
  return new Set(
    blocks.flatMap((block, index) =>
      index === except ? [] : blockCells(block),
    ),
  )
}
