import { HowToPlay } from '@/components/HowToPlay/HowToPlay'
import { Lightbulb, Undo2 } from 'lucide-react'
import { useState } from 'react'

import { formatDuration } from '@/common/format.functions'
import { useGameTimer } from '@/common/gameTimer.hooks'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
import {
  boardOf,
  isSolved,
  newGame,
  restart,
  revealSolution,
  slide,
  undo,
  withHint,
} from '@/common/slideOut/slideOut.functions'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import type { SlideOutGame } from '@/common/slideOut/slideOut.types'
import {
  decodeMoves,
  decodePuzzle,
  encodeMoves,
} from '@/common/slideOut/slideOutBoard.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/common/slideOut/slideOutSaves.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/common/slideOut/slideOutSaves.functions'
import type { SlideOutSettings } from '@/common/slideOut/slideOutSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { WinDialog } from '@/components/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { MoreMenu } from '@/components/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SlideOutBoard } from '@/components/SlideOutBoard/SlideOutBoard'

const TUTORIAL = [
  {
    target: '[aria-label="Board"]',
    text: 'Drag a block along its length to slide it. Free the red block through the gap on the right.',
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Stuck? The bulb highlights the block to move next.',
  },
  {
    target: '[aria-label="More"]',
    text: 'Restart, show the solution and settings live in this menu.',
  },
]

export function SlideOutGameView({ id }: { id: string }) {
  const { games, startRandom, saveProgress, finish, reveal } =
    useSlideOutGames()
  const saved = games.find((game) => game.id === id)
  const [settings] = useStoredState<SlideOutSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const [game, setGame] = useState<SlideOutGame | null>(() =>
    saved
      ? newGame({
          puzzle: decodePuzzle(saved.puzzle),
          moves: decodeMoves(saved.changes),
        })
      : null,
  )
  const [hints, setHints] = useState(saved?.hints ?? 0)
  const [revealing, setRevealing] = useState(false)
  const [result, setResult] = useState<{ newBest: boolean } | null>(null)
  const solved = game !== null && isSolved(game)
  const elapsedMs = useGameTimer({
    initialMs: saved?.elapsedMs ?? 0,
    running: game !== null && !solved,
  })

  if (!saved || !game) {
    return (
      <main className="mx-auto max-w-3xl px-4">
        <ScreenHeader title={TITLE} back={[GAME_ROUTE.SLIDE_OUT]} />
        <p>This puzzle could not be found.</p>
      </main>
    )
  }

  function persist({
    next,
    hintCount,
  }: {
    next: SlideOutGame
    hintCount: number
  }) {
    if (!saved) {
      return
    }
    const changes = encodeMoves(next.moves)
    if (isSolved(next)) {
      setResult({
        newBest: finish({
          id: saved.id,
          elapsedMs: elapsedMs(),
          changes,
          hints: hintCount,
        }),
      })
      return
    }
    saveProgress({
      id: saved.id,
      patch: { changes, hints: hintCount, elapsedMs: elapsedMs() },
    })
  }

  function move(change: (current: SlideOutGame) => SlideOutGame) {
    if (!game) {
      return
    }
    const next = change(game)
    setGame(next)
    if (next.moves !== game.moves) {
      persist({ next, hintCount: hints })
    }
  }

  function onReveal() {
    if (!game || !saved) {
      return
    }
    setGame(revealSolution(game))
    setRevealing(false)
    reveal({ id: saved.id, elapsedMs: elapsedMs() })
  }

  function onHint() {
    if (!game || solved) {
      return
    }
    if (game.hint !== null) {
      setGame({ ...game, hint: null })
      return
    }
    setGame(withHint(game))
    setHints(hints + 1)
    persist({ next: game, hintCount: hints + 1 })
  }

  const par = game.puzzle.par
  const moveCount = game.moves.length

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-4 pb-6">
      <div className="w-full">
        <ScreenHeader
          title={slideOutTitle(saved)}
          subtitle={[
            `Moves ${moveCount}`,
            settings.showPar ? `Par ${par}` : null,
            settings.showTimer ? formatDuration(elapsedMs()) : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          back={[GAME_ROUTE.SLIDE_OUT]}
        >
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last move"
            disabled={moveCount === 0 || solved}
            onClick={() => move(undo)}
          >
            <Undo2 className="size-5" />
          </Button>
          {settings.showHints && (
            <Button
              size={BUTTON_SIZE.ICON}
              aria-label="Show a hint"
              disabled={solved}
              onClick={onHint}
            >
              <Lightbulb className="size-5" />
            </Button>
          )}
          {settings.showTutorial && (
            <HowToPlay steps={TUTORIAL}>
              <p>Slide the red block out through the gap on the right.</p>
              <p>
                Blocks only slide along their length: across ones left and
                right, upright ones up and down.
              </p>
              <p>
                Each slide of a block is one move, however far it goes. Par is
                the fewest moves possible.
              </p>
            </HowToPlay>
          )}
          <MoreMenu
            items={[
              {
                label: 'Restart this puzzle',
                onClick: () => !solved && move(restart),
              },
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
                  navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <SlideOutBoard
        blocks={boardOf(game)}
        hint={game.hint}
        onSlide={({ block, position }) =>
          move((current) => slide({ game: current, block, position }))
        }
      />
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
      <WinDialog
        open={result !== null}
        title="Solved!"
        accent={MENU_ACCENT.SLIDE_OUT}
        newBest={result?.newBest ?? false}
        stats={[
          {
            label: 'Moves',
            value:
              moveCount <= par ? `${moveCount}, par!` : `${moveCount} / ${par}`,
          },
          { label: 'Time', value: formatDuration(elapsedMs()) },
          ...(hints > 0 ? [{ label: 'Hints', value: hints }] : []),
        ]}
        onClose={() => setResult(null)}
        actions={
          <>
            <Button onClick={() => replaceRoute([GAME_ROUTE.SLIDE_OUT])}>
              Home
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => {
                replaceRoute([GAME_ROUTE.SLIDE_OUT])
                startRandom(levelOf(saved))
              }}
            >
              New puzzle
            </Button>
          </>
        }
      />
    </main>
  )
}
