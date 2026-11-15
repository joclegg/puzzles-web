import { useState } from 'react'

import { useGameTimer } from '@/shared/game/gameTimer.hooks'
import {
  revealPuzzle,
  solvePuzzle,
  trimPuzzleSteps,
  startPuzzle,
  updatePuzzle,
} from '@/shared/game/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import type { GameRoute } from '@/shared/lib/route.types'
import { useStoredState } from '@/shared/storage/storage.hooks'

export function usePuzzleGame<G>({
  saves,
  id,
  load,
  isSolved,
  entriesOf,
}: {
  saves: ReturnType<typeof usePuzzleGames>
  id: string
  load: (saved: SavedPuzzle) => G
  isSolved: (game: G) => boolean
  entriesOf?: (game: G) => string
}) {
  const saved = saves.games.find((game) => game.id === id)
  const [game, setGame] = useState<G | null>(() => (saved ? load(saved) : null))
  const [revealing, setRevealing] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const { elapsedMs, clock } = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })

  function save({
    next,
    changes,
    hints,
    mistakes,
  }: {
    next: G
    changes: string
    hints?: number
    mistakes?: number
  }) {
    if (!saved) {
      return
    }
    const entries = entriesOf?.(next)
    if (isSolved(next)) {
      setResult({
        newBest: saves.finish({
          id: saved.id,
          elapsedMs: elapsedMs(),
          changes,
          entries,
          hints: hints ?? 0,
          mistakes,
        }),
      })
      return
    }
    saves.saveProgress({
      id: saved.id,
      patch: {
        changes,
        ...(entries === undefined ? {} : { entries }),
        elapsedMs: elapsedMs(),
        ...(hints === undefined ? {} : { hints }),
        ...(mistakes === undefined ? {} : { mistakes }),
      },
    })
  }

  function reveal(next: G) {
    if (!saved) {
      return
    }
    setGame(next)
    setRevealing(false)
    saves.reveal({
      id: saved.id,
      elapsedMs: elapsedMs(),
      entries: entriesOf?.(next),
    })
  }

  return {
    saved,
    game,
    setGame,
    revealing,
    setRevealing,
    result,
    setResult,
    solved,
    elapsedMs,
    clock,
    save,
    reveal,
  }
}

export function usePuzzleGames({
  key,
  route,
  strip,
}: {
  key: string
  route: GameRoute
  strip?: (game: SavedPuzzle) => SavedPuzzle
}) {
  function trimLater() {
    setTimeout(() => setGames((all) => trimPuzzleSteps({ games: all, strip })))
  }
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([route, SCREEN.GAME, game.id])
  }

  function startAndOpen(ref: PuzzleRef) {
    const created = startPuzzle({
      games,
      id: crypto.randomUUID(),
      ref,
      now: Date.now(),
    })
    setGames(() => created.games)
    openGame(created.game)
  }

  function openExisting(puzzleId: string): boolean {
    const existing = games.findLast((game) => game.puzzleId === puzzleId)
    if (existing) {
      openGame(existing)
    }
    return existing !== undefined
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: string
    patch: Partial<SavedPuzzle>
  }) {
    setGames((all) => updatePuzzle({ games: all, id, patch }))
  }

  function finish({
    id,
    elapsedMs,
    changes,
    entries,
    hints,
    mistakes,
  }: {
    id: string
    elapsedMs: number
    changes: string
    entries?: string
    hints: number
    mistakes?: number
  }): boolean {
    const finished = solvePuzzle({
      games,
      id,
      elapsedMs,
      changes,
      entries,
      hints,
      mistakes,
      now: Date.now(),
    })
    setGames(() => finished.games)
    trimLater()
    return finished.newBest
  }

  function reveal({
    id,
    elapsedMs,
    entries,
  }: {
    id: string
    elapsedMs: number
    entries?: string
  }) {
    setGames((all) =>
      revealPuzzle({ games: all, id, elapsedMs, entries, now: Date.now() }),
    )
    trimLater()
  }

  return {
    games,
    openGame,
    startAndOpen,
    openExisting,
    saveProgress,
    finish,
    reveal,
  }
}
