import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { RevealDialog } from '@/shared/game/RevealDialog/RevealDialog'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { Lightbulb, Undo2 } from 'lucide-react'
import { useState } from 'react'

import { formatDuration } from '@/shared/lib/format.functions'
import { usePuzzleGame } from '@/shared/game/puzzleGame.hooks'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate, replaceRoute } from '@/shared/lib/route.hooks'
import {
  boardOf,
  isSolved,
  newGame,
  restart,
  revealSolution,
  slide,
  undo,
  withHint,
} from '@/games/slideOut/engine/slideOut.functions'
import { useSlideOutGames } from '@/games/slideOut/engine/slideOut.hooks'
import type { SlideOutGame } from '@/games/slideOut/engine/slideOut.types'
import {
  decodeMoves,
  decodePuzzle,
  encodeMoves,
} from '@/games/slideOut/engine/slideOutBoard.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/games/slideOut/engine/slideOutSaves.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/games/slideOut/engine/slideOutSaves.functions'
import type { SlideOutSettings } from '@/games/slideOut/engine/slideOutSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { SlideOutBoard } from '@/games/slideOut/ui/SlideOutBoard/SlideOutBoard'

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
  const {
    game,
    setGame,
    revealing,
    setRevealing,
    result,
    setResult,
    solved,
    elapsedMs,
  } = usePuzzleGame({
    saved,
    load: (saved): SlideOutGame =>
      newGame({
        puzzle: decodePuzzle(saved.puzzle),
        moves: decodeMoves(saved.changes),
      }),
    isSolved,
  })
  const [hints, setHints] = useState(saved?.hints ?? 0)

  if (!saved || !game) {
    return (
      <GameNotFound
        title={TITLE}
        back={[GAME_ROUTE.SLIDE_OUT]}
        message="This puzzle could not be found."
      />
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
      <RevealDialog
        open={revealing}
        onClose={() => setRevealing(false)}
        onReveal={onReveal}
      />
      <WinDialog
        open={result !== null}
        title="Solved!"
        accent={MENU_ACCENT.SLIDE_OUT}
        route={GAME_ROUTE.SLIDE_OUT}
        newLabel={
          levelOf(saved).charAt(0).toUpperCase() + levelOf(saved).slice(1)
        }
        onNew={() => {
          replaceRoute([GAME_ROUTE.SLIDE_OUT])
          startRandom(levelOf(saved))
        }}
        newBest={result?.newBest ?? false}
        stats={[
          {
            label: 'Moves',
            value:
              moveCount <= par
                ? `${moveCount} moves, par!`
                : `${moveCount} moves, par is ${par}`,
          },
          { label: 'Time', value: formatDuration(elapsedMs()) },
          ...(hints > 0 ? [{ label: 'Hints', value: hints }] : []),
        ]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => replaceRoute([GAME_ROUTE.SLIDE_OUT])}>
            Home
          </Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.SLIDE_OUT} />
    </main>
  )
}
