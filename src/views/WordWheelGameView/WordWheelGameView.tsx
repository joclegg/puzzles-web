import { HowToPlay } from '@/components/HowToPlay/HowToPlay'
import { Check, Lightbulb, Shuffle, X } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'

import { formatDuration } from '@/common/format.functions'
import { useGameTimer } from '@/common/gameTimer.hooks'
import {
  createRandom,
  newSeed,
  randomItem,
  shuffled,
} from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { GUESS_MESSAGE } from '@/common/wordWheel/wordWheel.constants'
import {
  isSolved,
  newGame,
  reveal,
  revealAll,
  shownCells,
  shuffleWheel,
  submit,
} from '@/common/wordWheel/wordWheel.functions'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import type { WordWheelGame } from '@/common/wordWheel/wordWheel.types'
import { VALID_WORDS } from '@/common/wordWheel/wordWheelBank.constants'
import { decodePuzzle } from '@/common/wordWheel/wordWheelCrossword.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/common/wordWheel/wordWheelSaves.constants'
import {
  decodeProgress,
  encodeProgress,
  levelOf,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'
import type { WordWheelSettings } from '@/common/wordWheel/wordWheelSaves.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { WordWheelGrid } from '@/components/WordWheelGrid/WordWheelGrid'
import { WordWheelLetters } from '@/components/WordWheelLetters/WordWheelLetters'

const TUTORIAL = [
  {
    target: '[aria-label="Crossword"]',
    text: 'Find every word in this crossword.',
  },
  {
    target: '[aria-label="Letters"]',
    text: 'Swipe across the letters to make a word, or tap them in turn and press the tick.',
  },
  {
    target: '[aria-label="Show a letter"]',
    text: 'Stuck? The bulb fills in one letter of the crossword.',
  },
]

export function WordWheelGameView({ id }: { id: number }) {
  const { games, startRandom, saveProgress, finish, revealSaved } =
    useWordWheelGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<WordWheelSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<WordWheelGame | null>(() =>
    saved
      ? newGame({
          puzzle: decodePuzzle(saved.puzzle),
          ...decodeProgress(saved.changes),
        })
      : null,
  )
  const [random] = useState(() => createRandom(newSeed()))
  const [chosen, setChosen] = useState<number[]>([])
  const [revealing, setRevealing] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (!game || event.ctrlKey || event.metaKey || event.altKey) {
      return
    }
    if (event.key === 'Enter') {
      enter()
    } else if (event.key === 'Backspace') {
      setChosen((current) => current.slice(0, -1))
    } else if (event.key.length === 1) {
      const letter = event.key.toUpperCase()
      const index = [...game.wheel].findIndex(
        (it, i) => it === letter && !chosen.includes(i),
      )
      if (index >= 0) {
        setChosen([...chosen, index])
      }
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!saved || !game) {
    return (
      <main className="mx-auto max-w-3xl px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.WORD_WHEEL]} />
        <p>This puzzle could not be found.</p>
      </main>
    )
  }

  function update(next: WordWheelGame) {
    if (!saved || !game) {
      return
    }
    setGame(next)
    if (
      next.found === game.found &&
      next.bonus === game.bonus &&
      next.revealed === game.revealed
    ) {
      return
    }
    const changes = encodeProgress(next)
    if (isSolved(next)) {
      setResult({
        newBest: finish({
          id: saved.id,
          elapsedMs: elapsedMs(),
          changes,
          hints: next.revealed.length,
        }),
      })
      return
    }
    saveProgress({
      id: saved.id,
      patch: {
        changes,
        hints: next.revealed.length,
        elapsedMs: elapsedMs(),
      },
    })
  }

  function onReveal() {
    if (!game || !saved) {
      return
    }
    setGame(revealAll(game))
    setChosen([])
    setRevealing(false)
    revealSaved({ id: saved.id, elapsedMs: elapsedMs() })
  }

  function enter() {
    if (!game || chosen.length === 0) {
      return
    }
    const word = chosen.map((index) => game.wheel[index]).join('')
    setChosen([])
    update(submit({ game, word, valid: VALID_WORDS }))
  }

  const word = chosen.map((index) => game.wheel[index]).join('')
  const shown = shownCells(game)

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-4 pb-6">
      <div className="w-full">
        <ScreenHeader
          title={wordWheelTitle(saved)}
          subtitle={[
            settings.showTimer ? formatDuration(elapsedMs()) : null,
            settings.showBonusCount ? `Bonus ${game.bonus.length}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          back={[GAME_ROUTE.WORD_WHEEL]}
        >
          {settings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a letter"
              disabled={solved}
              onClick={() =>
                update(
                  reveal({
                    game,
                    pick: (hidden) =>
                      hidden.length === 0
                        ? undefined
                        : randomItem({ items: hidden, random }),
                  }),
                )
              }
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {settings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>
                Swipe across the letters to make a word, or tap them and press
                the tick.
              </p>
              <p>
                Find every word in the crossword. Other real words count as
                bonus words.
              </p>
              <p>Each letter can be used once per word.</p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              {
                label: 'New puzzle',
                onClick: () => startRandom(levelOf(saved)),
              },
              ...(settings.allowReveal && !solved
                ? [
                    {
                      label: 'Show solution',
                      onClick: () => setRevealing(true),
                    },
                  ]
                : []),
              {
                label: 'Settings',
                onClick: () =>
                  navigate([GAME_ROUTE.WORD_WHEEL, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <div className="flex w-full flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
        <div className="flex w-full justify-center lg:flex-1">
          <WordWheelGrid
            puzzle={game.puzzle}
            shown={shown}
            revealed={new Set(game.revealed)}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-3 lg:w-80 lg:shrink-0">
          <p className="h-6 text-sm font-semibold" role="status">
            {game.last ? GUESS_MESSAGE[game.last] : ''}
          </p>
          <div className="flex h-10 items-center gap-2">
            <span
              className="min-w-24 text-center text-2xl font-bold tracking-widest"
              aria-label="Word"
            >
              {word}
            </span>
          </div>
          <WordWheelLetters
            wheel={game.wheel}
            chosen={chosen}
            onChoose={(index) => setChosen((current) => [...current, index])}
            onSwipeEnd={enter}
          />
          <div className="flex gap-3">
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              size={BUTTON_SIZE.ICON}
              aria-label="Shuffle the letters"
              onClick={() => {
                setChosen([])
                setGame(
                  shuffleWheel({
                    game,
                    order: shuffled({
                      items: [...game.wheel].map((_, i) => i),
                      random,
                    }),
                  }),
                )
              }}
            >
              <Shuffle className="size-5" />
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              size={BUTTON_SIZE.ICON}
              aria-label="Enter the word"
              onClick={enter}
            >
              <Check className="size-5" />
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              size={BUTTON_SIZE.ICON}
              aria-label="Clear the word"
              onClick={() => setChosen([])}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <AppDialog
        open={revealing}
        title="Show the solution?"
        onClose={() => setRevealing(false)}
        actions={
          <>
            <Button onClick={() => setRevealing(false)}>Cancel</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onReveal}>
              Show solution
            </Button>
          </>
        }
      >
        <p>This ends the puzzle. It won't count towards best times.</p>
      </AppDialog>
      <AppDialog
        open={result !== null}
        title="Solved!"
        onClose={() => setResult(null)}
        actions={
          <>
            <Button onClick={() => navigate([GAME_ROUTE.WORD_WHEEL])}>
              Home
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => startRandom(levelOf(saved))}
            >
              New puzzle
            </Button>
          </>
        }
      >
        {result?.newBest && <p className="font-bold text-primary">New best!</p>}
        <p>Time {formatDuration(elapsedMs())}</p>
        <p>Bonus words {game.bonus.length}</p>
      </AppDialog>
    </main>
  )
}
