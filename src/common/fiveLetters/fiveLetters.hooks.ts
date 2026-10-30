import { useMemo } from 'react'

import { fetchBank, useBank } from '@/common/bank.hooks'
import {
  ANSWERS_PATH,
  GUESSES_PATH,
} from '@/common/fiveLetters/fiveLettersWords.constants'
import {
  createWords,
  nytSolution,
  randomWord,
} from '@/common/fiveLetters/fiveLetters.functions'
import type { Words } from '@/common/fiveLetters/fiveLetters.types'
import {
  DEFAULT_SETTINGS,
  GAMES_KEY,
  NYT_PROXY_URL,
  SETTINGS_KEY,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  nytId,
  startGame,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import type {
  FiveLettersSettings,
  SavedGame,
  WordRef,
} from '@/common/fiveLetters/fiveLettersSaves.types'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { readStored } from '@/common/storage.functions'
import { useStoredState } from '@/common/storage.hooks'

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

  async function startNytDaily(date: string): Promise<boolean> {
    const answer = await fetchNytWord(date)
    if (answer === null) {
      return false
    }
    startAndOpen({ id: nytId(date), answer })
    return true
  }

  return {
    games,
    setGames,
    openGame,
    startAndOpen,
    startPractice,
    startNytDaily,
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

async function fetchNytWord(date: string): Promise<string | null> {
  try {
    const response = await fetch(`${NYT_PROXY_URL}${date}.json`)
    return response.ok ? nytSolution(await response.text()) : null
  } catch {
    return null
  }
}
