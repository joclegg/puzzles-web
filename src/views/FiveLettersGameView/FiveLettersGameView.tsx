import { useFiveLettersGames } from '@/common/fiveLetters/fiveLetters.hooks'
import { CircleHelp, Share2 } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'

import { cn } from '@/common/utils.functions'
import { REJECTION_MESSAGE } from '@/common/fiveLetters/fiveLetters.constants'
import {
  dayNumber,
  deleteLetter,
  isLost,
  isOver,
  isWon,
  letterMarks,
  newGame,
  shareText,
  submit,
  typeLetter,
} from '@/common/fiveLetters/fiveLetters.functions'
import type { FiveLettersGame } from '@/common/fiveLetters/fiveLetters.types'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  finishGame,
  isDaily,
  saveGuesses,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import type { FiveLettersSettings } from '@/common/fiveLetters/fiveLettersSaves.types'
import { TITLE, WORDS } from '@/common/fiveLetters/fiveLettersWords.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { FiveLettersBoard } from '@/components/FiveLettersBoard/FiveLettersBoard'
import { FiveLettersKeyboard } from '@/components/FiveLettersKeyboard/FiveLettersKeyboard'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function FiveLettersGameView({ id }: { id: number }) {
  const { games, setGames, startPractice } = useFiveLettersGames()
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
        })
      : null,
  )
  const [rulesOpen, setRulesOpen] = useState(false)
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
      <main className="mx-auto max-w-md px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.FIVE_LETTERS]} />
        <p>This game could not be found.</p>
      </main>
    )
  }

  const daily = isDaily(saved.wordId)
  const title = daily
    ? `${TITLE} #${dayNumber(saved.wordId.slice('daily_'.length))}`
    : `${TITLE} practice`
  const over = isOver(game)
  const share = shareText({ game, title })

  function change(edit: (current: FiveLettersGame) => FiveLettersGame) {
    setGame((current) => (current ? edit(current) : current))
  }

  function enter() {
    if (!game || !saved) {
      return
    }
    const after = submit({ game, words: WORDS })
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
        'mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-3 px-2 pb-4',
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
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Show the rules"
            onClick={() => setRulesOpen(true)}
          >
            <CircleHelp className="size-5" />
          </Button>
          <MoreMenu
            items={[
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
        {game.rejection ? REJECTION_MESSAGE[game.rejection] : ''}
      </p>
      <div className="flex flex-1 items-center justify-center">
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
        open={rulesOpen}
        title="How to play"
        onClose={() => setRulesOpen(false)}
        actions={<Button onClick={() => setRulesOpen(false)}>Got it</Button>}
      >
        <p>
          Guess the five-letter word in six tries. After each guess the tiles
          change colour:
        </p>
        <p>Green: right letter, right place.</p>
        <p>Yellow: in the word, wrong place.</p>
        <p>Grey: not in the word.</p>
      </AppDialog>
      <AppDialog
        open={over && !resultClosed}
        title={
          isWon(game)
            ? `Got it in ${game.guesses.length}!`
            : `The word was ${game.answer}`
        }
        onClose={() => setResultClosed(true)}
        actions={
          <>
            <Button onClick={() => setResultClosed(true)}>Close</Button>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onShare}>
              {copied ? 'Copied' : 'Share'}
            </Button>
            {!daily && (
              <Button variant={BUTTON_VARIANT.OUTLINE} onClick={startPractice}>
                New word
              </Button>
            )}
          </>
        }
      >
        <p>
          {daily
            ? 'A new word comes tomorrow. Share your grid without giving the word away.'
            : 'Play another practice word, or share your grid.'}
        </p>
        {isLost(game) && <p className="sr-only">Lost</p>}
      </AppDialog>
    </main>
  )
}
