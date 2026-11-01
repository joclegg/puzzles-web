import { useMemo } from 'react'

import { fetchBank, useBank } from '@/shared/bank/bank.hooks'
import {
  ANSWERS_PATH,
  GUESSES_PATH,
} from '@/games/fiveLetters/engine/fiveLettersWords.constants'
import {
  createWords,
  daily2Word,
  randomWord,
} from '@/games/fiveLetters/engine/fiveLetters.functions'
import type { Words } from '@/games/fiveLetters/engine/fiveLetters.types'
import {
  DEFAULT_SETTINGS,
  GAMES_KEY,
  DAILY2_URL,
  SETTINGS_KEY,
} from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import {
  daily2Id,
  startGame,
} from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import type {
  FiveLettersSettings,
  SavedGame,
  WordRef,
} from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { readStored } from '@/shared/storage/storage.functions'
import { useStoredState } from '@/shared/storage/storage.hooks'

export async function loadWords(): Promise<Words> {
  const [answers, guesses] = await Promise.all([
    fetchBank(ANSWERS_PATH),
    fetchBank(GUESSES_PATH),
  ])
  return createWords({
    answers: answers.split('\n'),
    guesses: guesses.split('\n'),
  })
}

export function useFiveLettersGames() {
  const [games, setGames] = useStoredState<SavedGame[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedGame) {
    navigate([GAME_ROUTE.FIVE_LETTERS, SCREEN.GAME, game.id])
  }

  function startAndOpen(ref: WordRef) {
    const { hardMode } = readStored<FiveLettersSettings>({
      key: SETTINGS_KEY,
      fallback: DEFAULT_SETTINGS,
    })
    const created = startGame({
      id: crypto.randomUUID(),
      games: readStored<SavedGame[]>({ key: GAMES_KEY, fallback: [] }),
      ref,
      hardMode,
      now: Date.now(),
    })
    setGames(() => created.games)
    openGame(created.game)
  }

  async function startPractice() {
    const seed = newSeed()
    startAndOpen({
      id: `practice_${seed}`,
      answer: randomWord({ words: await loadWords(), seed }),
    })
  }

  async function startDaily2(date: string): Promise<boolean> {
    const answer = await fetchDaily2Word(date)
    if (answer === null) {
      return false
    }
    startAndOpen({ id: daily2Id(date), answer })
    return true
  }

  return {
    games,
    setGames,
    openGame,
    startAndOpen,
    startPractice,
    startDaily2,
  }
}

export function useWords(): Words | null {
  const answers = useBank(ANSWERS_PATH)
  const guesses = useBank(GUESSES_PATH)
  return useMemo(
    () =>
      answers === null || guesses === null
        ? null
        : createWords({
            answers: answers.split('\n'),
            guesses: guesses.split('\n'),
          }),
    [answers, guesses],
  )
}

async function fetchDaily2Word(date: string): Promise<string | null> {
  try {
    const response = await fetch(`${DAILY2_URL}${date}`)
    return response.ok ? daily2Word(await response.json()) : null
  } catch {
    return null
  }
}
