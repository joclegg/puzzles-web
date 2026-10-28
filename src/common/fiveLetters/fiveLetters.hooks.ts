import {
  nytSolution,
  randomWord,
} from '@/common/fiveLetters/fiveLetters.functions'
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
import { WORDS } from '@/common/fiveLetters/fiveLettersWords.constants'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { readStored } from '@/common/storage.functions'
import { useStoredState } from '@/common/storage.hooks'

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

  function startPractice() {
    const seed = newSeed()
    startAndOpen({
      id: `practice_${seed}`,
      answer: randomWord({ words: WORDS, seed }),
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

async function fetchNytWord(date: string): Promise<string | null> {
  try {
    const response = await fetch(`${NYT_PROXY_URL}${date}.json`)
    return response.ok ? nytSolution(await response.text()) : null
  } catch {
    return null
  }
}
