import { useMemo } from 'react'

import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import {
  revealPuzzle,
  solvePuzzle,
  startPuzzle,
  updatePuzzle,
} from '@/common/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/common/puzzleSaves.types'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { LEVELS } from '@/common/wordWheel/wordWheel.constants'
import type { Level } from '@/common/wordWheel/wordWheel.types'
import { fetchBank, useBank } from '@/common/bank.hooks'
import { VALID_WORDS_PATH } from '@/common/wordWheel/wordWheelBank.constants'
import {
  bankLines,
  dailyIndex,
  randomIndex,
} from '@/common/wordWheel/wordWheelBank.functions'
import { validWords } from '@/common/wordWheel/wordWheel.functions'
import { GAMES_KEY } from '@/common/wordWheel/wordWheelSaves.constants'
import { useStoredState } from '@/common/storage.hooks'

export function useValidWords(): Set<string> | null {
  const text = useBank(VALID_WORDS_PATH)
  return useMemo(() => (text === null ? null : validWords(text)), [text])
}

export function useWordWheelGames() {
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([GAME_ROUTE.WORD_WHEEL, SCREEN.GAME, game.id])
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

  async function startRandom(level: Level) {
    const lines = bankLines(await fetchBank(`wordwheel/${level}.txt`))
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    startAndOpen({
      id: `bank_${level}_${index}`,
      size: LEVELS.indexOf(level),
      puzzle: lines[index],
    })
  }

  async function openDaily({ date, level }: { date: string; level: Level }) {
    const id = `${DAILY_PREFIX}${date}_${level}`
    const existing = games.findLast((game) => game.puzzleId === id)
    if (existing) {
      openGame(existing)
      return
    }
    const lines = bankLines(await fetchBank(`wordwheel/${level}.txt`))
    const index = dailyIndex({ count: lines.length, level, date })
    startAndOpen({ id, size: LEVELS.indexOf(level), puzzle: lines[index] })
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
    hints,
  }: {
    id: string
    elapsedMs: number
    changes: string
    hints: number
  }): boolean {
    const finished = solvePuzzle({
      games,
      id,
      elapsedMs,
      changes,
      hints,
      now: Date.now(),
    })
    setGames(() => finished.games)
    return finished.newBest
  }

  function revealSaved({ id, elapsedMs }: { id: string; elapsedMs: number }) {
    setGames((all) =>
      revealPuzzle({ games: all, id, elapsedMs, now: Date.now() }),
    )
  }

  return {
    games,
    openGame,
    startRandom,
    openDaily,
    saveProgress,
    finish,
    revealSaved,
  }
}
