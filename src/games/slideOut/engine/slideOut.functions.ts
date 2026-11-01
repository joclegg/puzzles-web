import type {
  Block,
  Move,
  Puzzle,
  SlideOutGame,
} from '@/games/slideOut/engine/slideOut.types'
import {
  blockPosition,
  isBoardSolved,
  moveBlock,
  slideRange,
} from '@/games/slideOut/engine/slideOutBoard.functions'
import { shortestPath } from '@/games/slideOut/engine/slideOutSolver.functions'

export function boardOf(game: SlideOutGame): Block[] {
  return game.moves.reduce(
    (blocks, move) =>
      moveBlock({ blocks, index: move.block, position: move.position }),
    game.puzzle.blocks,
  )
}

export function isSolved(game: SlideOutGame): boolean {
  return isBoardSolved(boardOf(game))
}

export function newGame({
  puzzle,
  moves = [],
}: {
  puzzle: Puzzle
  moves?: Move[]
}): SlideOutGame {
  return { puzzle, moves, hint: null }
}

export function restart(game: SlideOutGame): SlideOutGame {
  return newGame({ puzzle: game.puzzle })
}

export function revealSolution(game: SlideOutGame): SlideOutGame {
  return {
    ...game,
    moves: [...game.moves, ...(shortestPath(boardOf(game)) ?? [])],
    hint: null,
  }
}

export function slide({
  game,
  block,
  position,
}: {
  game: SlideOutGame
  block: number
  position: number
}): SlideOutGame {
  const blocks = boardOf(game)
  const range = slideRange({ blocks, index: block })
  if (
    isSolved(game) ||
    position === blockPosition(blocks[block]) ||
    position < range.low ||
    position > range.high
  ) {
    return { ...game, hint: null }
  }
  const last = game.moves.at(-1)
  const merged =
    last?.block === block
      ? [...game.moves.slice(0, -1), { block, position }]
      : [...game.moves, { block, position }]
  const final = merged.at(-1)!
  const back =
    final.block === block &&
    final.position === previousPosition({ game, block, moves: merged })
  return { ...game, moves: back ? merged.slice(0, -1) : merged, hint: null }
}

export function undo(game: SlideOutGame): SlideOutGame {
  if (isSolved(game) || game.moves.length === 0) {
    return { ...game, hint: null }
  }
  return { ...game, moves: game.moves.slice(0, -1), hint: null }
}

export function withHint(game: SlideOutGame): SlideOutGame {
  if (isSolved(game)) {
    return game
  }
  return { ...game, hint: shortestPath(boardOf(game))?.[0] ?? null }
}

function previousPosition({
  game,
  block,
  moves,
}: {
  game: SlideOutGame
  block: number
  moves: Move[]
}): number {
  const earlier = moves.slice(0, -1).findLast((move) => move.block === block)
  return earlier?.position ?? blockPosition(game.puzzle.blocks[block])
}
