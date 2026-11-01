import { useState } from 'react'

import { useGameTimer } from '@/common/gameTimer.hooks'

export function usePuzzleGame<S extends { elapsedMs: number }, G>({
  saved,
  load,
  isSolved,
}: {
  saved: S | undefined
  load: (saved: S) => G
  isSolved: (game: G) => boolean
}) {
  const [game, setGame] = useState<G | null>(() => (saved ? load(saved) : null))
  const [revealing, setRevealing] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })
  return {
    game,
    setGame,
    revealing,
    setRevealing,
    result,
    setResult,
    solved,
    elapsedMs,
  }
}
