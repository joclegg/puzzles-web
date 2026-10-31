import { HowToPlay } from '@/components/HowToPlay/HowToPlay'
import {
  useFiveLettersGames,
  useWords,
} from '@/common/fiveLetters/fiveLetters.hooks'
import { Lightbulb, Share2 } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'

import { cn } from '@/common/utils.functions'
import { REJECTION_MESSAGE } from '@/common/fiveLetters/fiveLetters.constants'
import {
  dayNumber,
  deleteLetter,
  hintLetter,
  isLost,
  isOver,
  isWon,
  letterMarks,
  newGame,
  revealWord,
  shareText,
  submit,
  typeLetter,
} from '@/common/fiveLetters/fiveLetters.functions'
import type { FiveLettersGame } from '@/common/fiveLetters/fiveLetters.types'
import {
  DEFAULT_SETTINGS,
  GAME_STATUS,
  SETTINGS_KEY,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  finishGame,
  isDaily,
  isDaily2,
  daily2Label,
  saveGuesses,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import type { FiveLettersSettings } from '@/common/fiveLetters/fiveLettersSaves.types'
import { TITLE } from '@/common/fiveLetters/fiveLettersWords.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { WinDialog } from '@/components/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { FiveLettersBoard } from '@/components/FiveLettersBoard/FiveLettersBoard'
import { FiveLettersKeyboard } from '@/components/FiveLettersKeyboard/FiveLettersKeyboard'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

const TUTORIAL = [
  {
    target: '[aria-label="Guesses"]',
    text: 'Guess the word in six tries. After each guess, green is the right letter in the right place, yellow is in the word but elsewhere, grey is not in the word.',
  },
  {
    target: '[aria-label="Keyboard"]',
    text: 'Type with these keys, then Enter. Delete is on the left.',
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Stuck? The bulb tells you one letter and where it goes.',
  },
]

export function FiveLettersGameView({ id }: { id: string }) {
  const { games, setGames, startPractice } = useFiveLettersGames()
  const words = useWords()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<FiveLettersSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<FiveLettersGame | null>(() =>
    saved
      ? newGame({
          answer: saved.answer,
          guesses: saved.guesses,
          hardMode: saved.hardMode,
          revealed: saved.status === GAME_STATUS.LOST,
        })
      : null,
  )
  const [hint, setHint] = useState<string | null>(null)
  const [revealing, setRevealing] = useState(false)
  const [resultClosed, setResultClosed] = useState(false)
  const [copied, setCopied] = useState(false)

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return
    }
    if (event.key === 'Enter') {
      enter()
    } else if (event.key === 'Backspace') {
      change(deleteLetter)
    } else if (event.key.length === 1) {
      change((current) => typeLetter({ game: current, letter: event.key }))
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!saved || !game) {
    return (
      <main className="mx-auto max-w-3xl px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.FIVE_LETTERS]} />
        <p>This game could not be found.</p>
      </main>
    )
  }

  const daily = isDaily(saved.wordId) || isDaily2(saved.wordId)
  const title = isDaily2(saved.wordId)
    ? daily2Label(saved.wordId)
    : isDaily(saved.wordId)
      ? `${TITLE} #${dayNumber(saved.wordId.slice('daily_'.length))}`
      : `${TITLE} practice`
  const over = isOver(game)
  const share = shareText({ game, title })

  function change(edit: (current: FiveLettersGame) => FiveLettersGame) {
    setGame((current) => (current ? edit(current) : current))
  }

  function onHint() {
    if (!game || isOver(game)) {
      return
    }
    const found = hintLetter(game)
    setHint(
      found === null
        ? null
        : `Letter ${found.index + 1} is ${found.letter.toUpperCase()}.`,
    )
  }

  function onReveal() {
    if (!game || !saved) {
      return
    }
    setGame(revealWord(game))
    setRevealing(false)
    setGames((current) =>
      finishGame({
        games: current,
        id: saved.id,
        guesses: game.guesses,
        won: false,
        now: Date.now(),
      }),
    )
  }

  function enter() {
    if (!game || !saved || words === null) {
      return
    }
    const after = submit({ game, words })
    setGame(after)
    if (after.guesses.length === game.guesses.length) {
      return
    }
    setGames((current) =>
      isOver(after)
        ? finishGame({
            games: current,
            id: saved.id,
            guesses: after.guesses,
            won: isWon(after),
            now: Date.now(),
          })
        : saveGuesses({ games: current, id: saved.id, guesses: after.guesses }),
    )
  }

  async function onShare() {
    if (navigator.share) {
      await navigator.share({ text: share }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(share)
    setCopied(true)
  }

  return (
    <main
      className={cn(
        'mx-auto flex h-dvh max-w-3xl flex-col items-center gap-2 px-2 pb-3',
        settings.highContrast && 'high-contrast',
      )}
    >
      <div className="w-full px-2">
        <ScreenHeader
          title={title}
          subtitle={game.hardMode ? 'Hard mode' : undefined}
          back={[GAME_ROUTE.FIVE_LETTERS]}
        >
          {over && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Share your result"
              onClick={onShare}
            >
              <Share2 className="size-5" />
            </Button>
          )}
          {settings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a hint"
              disabled={over}
              onClick={onHint}
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {settings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>
                Guess the five-letter word in six tries. After each guess the
                tiles change colour:
              </p>
              <p>Green: right letter, right place.</p>
              <p>Yellow: in the word, wrong place.</p>
              <p>Grey: not in the word.</p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              ...(settings.allowReveal && !over
                ? [
                    {
                      label: 'Show the word',
                      onClick: () => setRevealing(true),
                    },
                  ]
                : []),
              {
                label: 'Settings',
                onClick: () =>
                  navigate([GAME_ROUTE.FIVE_LETTERS, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <p className="h-6 text-sm font-semibold" role="status">
        {game.rejection
          ? REJECTION_MESSAGE[game.rejection]
          : over
            ? ''
            : (hint ?? '')}
      </p>
      <div className="[container-type:size] flex min-h-0 w-full flex-1 items-center justify-center">
        <FiveLettersBoard game={game} />
      </div>
      <FiveLettersKeyboard
        letterMarks={letterMarks(game)}
        onLetter={(letter) =>
          change((current) => typeLetter({ game: current, letter }))
        }
        onEnter={enter}
        onDelete={() => change(deleteLetter)}
      />
      <AppDialog
        open={revealing}
        title="Show the word?"
        onClose={() => setRevealing(false)}
        actions={
          <>
            <Button onClick={() => setRevealing(false)}>Cancel</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onReveal}>
              Show the word
            </Button>
          </>
        }
      >
        <p>This ends the game and counts as a loss.</p>
      </AppDialog>
      <WinDialog
        open={over && !resultClosed}
        title={
          isWon(game)
            ? `Got it in ${game.guesses.length}!`
            : `The word was ${game.answer}`
        }
        accent={MENU_ACCENT.FIVE_LETTERS}
        route={GAME_ROUTE.FIVE_LETTERS}
        newLabel="Word"
        onNew={daily ? undefined : startPractice}
        newBest={false}
        lost={isLost(game)}
        stats={[]}
        message={
          daily
            ? 'A new word comes tomorrow. Share your grid without giving the word away.'
            : 'Play another practice word, or share your grid.'
        }
        onClose={() => setResultClosed(true)}
        actions={
          <>
            <Button onClick={() => setResultClosed(true)}>Close</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onShare}>
              {copied ? 'Copied' : 'Share'}
            </Button>
          </>
        }
      />
    </main>
  )
}
