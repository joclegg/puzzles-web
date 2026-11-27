import { DEFINITION } from '@/games/crossword/definition'
import { OPTIONS } from '@/games/crossword/ui/CrosswordView/CrosswordView.constants'
import { puzzleWinShare } from '@/shared/game/share.functions'
import { todayIso } from '@/shared/lib/date.functions'
import { Lightbulb, Redo2, Undo2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { useBank } from '@/shared/bank/bank.hooks'
import { ElapsedTime } from '@/shared/game/ElapsedTime/ElapsedTime'
import { GameNotFound } from '@/shared/game/GameNotFound/GameNotFound'
import { HowToPlay } from '@/shared/game/HowToPlay/HowToPlay'
import { RevealDialog } from '@/shared/game/RevealDialog/RevealDialog'
import { WinDialog } from '@/shared/game/WinDialog/WinDialog'
import { usePuzzleGame } from '@/shared/game/puzzleGame.hooks'
import { HINT_STYLE } from '@/shared/game/assists.constants'
import { CLUES_PATH } from '@/games/crossword/engine/crossword.constants'
import {
  applyInput,
  currentWord,
  encodeChanges,
  encodeEntries,
  isSolved,
  loadGame,
  nextClue,
  placeHint,
  pointHint,
  pressKey,
  redo,
  restart,
  revealLetter,
  revealSolution,
  revealWord,
  selectWord,
  tapCell,
  undo,
  wrongCells,
} from '@/games/crossword/engine/crossword.functions'
import { useCrosswordGames } from '@/games/crossword/engine/crossword.hooks'
import type {
  CrosswordGame,
  CrosswordHint,
  Word,
} from '@/games/crossword/engine/crossword.types'
import { findHint } from '@/games/crossword/engine/crosswordHint.functions'
import {
  clueLabel,
  decodePuzzle,
  parseClues,
} from '@/games/crossword/engine/crosswordPuzzle.functions'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  TITLE,
} from '@/games/crossword/engine/crosswordSaves.constants'
import {
  crosswordSizeLabel,
  crosswordTitle,
} from '@/games/crossword/engine/crosswordSaves.functions'
import type { CrosswordSettings } from '@/games/crossword/engine/crosswordSaves.types'
import { useSelectedCellInView } from '@/games/crossword/ui/CrosswordGameView/CrosswordGameView.hooks'
import { CrosswordBoard } from '@/games/crossword/ui/CrosswordBoard/CrosswordBoard'
import { CrosswordClueBar } from '@/games/crossword/ui/CrosswordClueBar/CrosswordClueBar'
import { CrosswordClueList } from '@/games/crossword/ui/CrosswordClueList/CrosswordClueList'
import { CrosswordInput } from '@/games/crossword/ui/CrosswordInput/CrosswordInput'
import { formatDuration } from '@/shared/lib/format.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { CustomiseHelpers } from '@/shared/screens/CustomiseHelpers/CustomiseHelpers'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { MoreMenu } from '@/shared/ui/MoreMenu/MoreMenu'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

const TUTORIAL = [
  {
    target: '[aria-label="Board"]',
    text: 'Tap a cell to pick it, then type the answer. Tap it again to switch between across and down.',
  },
  {
    target: '[data-testid="clue_bar"]',
    text: "This is the clue for the word you're on. The arrows move to the previous or next clue.",
  },
  {
    target: '[aria-label="Show a hint"]',
    text: 'Stuck? The bulb tells you one letter and where it goes.',
  },
  {
    target: '[aria-label="More"]',
    text: 'Restart, new puzzle, reveal a letter, word or the puzzle, and settings live in this menu.',
  },
]

export function CrosswordGameView({ id }: { id: string }) {
  const saves = useCrosswordGames()
  const [settings] = useStoredState<CrosswordSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const cluesText = useBank(CLUES_PATH)
  const inputRef = useRef<HTMLInputElement>(null)
  useSelectedCellInView()
  const {
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
    reveal: revealSaved,
  } = usePuzzleGame({
    saves,
    id,
    load: (saved): CrosswordGame =>
      loadGame({
        puzzle: decodePuzzle(saved.puzzle),
        changes: saved.changes,
        entries: saved.entries,
        hints: saved.hints,
        mistakes: saved.mistakes,
      }),
    isSolved,
    entriesOf: encodeEntries,
  })
  const [hint, setHint] = useState<CrosswordHint | null>(null)

  if (!saved || !game) {
    return (
      <GameNotFound
        title={TITLE}
        back={[GAME_ROUTE.CROSSWORD]}
        message="This puzzle could not be found."
      />
    )
  }

  const current: CrosswordGame = {
    ...game,
    skipFilledCells: settings.skipFilledCells,
    showMistakes: settings.showMistakes,
  }
  const clues = parseClues(cluesText ?? '')
  const word = currentWord(current)

  function commit(next: CrosswordGame) {
    setGame(next)
    setHint(null)
    if (
      next.changes === current.changes &&
      next.hints === current.hints &&
      next.mistakes === current.mistakes
    ) {
      return
    }
    save({
      next,
      changes: encodeChanges(next.changes),
      hints: next.hints,
      mistakes: next.mistakes,
    })
  }

  function onHint() {
    const found = findHint(current)
    if (found === null || solved) {
      return
    }
    if (settings.hintStyle === HINT_STYLE.FILL) {
      commit(placeHint({ game: current, hint: found }))
      return
    }
    commit(pointHint({ game: current, hint: found }))
    setHint(found)
  }

  function focusInput() {
    inputRef.current?.focus({ preventScroll: true })
  }

  function clueOf(target: Word) {
    return clueLabel({ clues, word: target })
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center gap-3 px-3 pb-6">
      <div className="w-full">
        <ScreenHeader
          title={crosswordTitle(saved)}
          subtitle={[settings.showTimer ? <ElapsedTime clock={clock} /> : null]}
          back={[GAME_ROUTE.CROSSWORD]}
        >
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Undo the last letter"
            disabled={current.changes.length === 0 || solved}
            onClick={() => commit(undo(current))}
          >
            <Undo2 className="size-5" />
          </Button>
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="Redo the letter you undid"
            disabled={current.undone.length === 0 || solved}
            onClick={() => commit(redo(current))}
          >
            <Redo2 className="size-5" />
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
          <HowToPlay steps={TUTORIAL}>
            <p>Fill the grid with the answers to the clues.</p>
            <p>
              Tap a cell to pick it. Tap it again to switch between across and
              down.
            </p>
            <p>Type the answer with the keyboard.</p>
          </HowToPlay>
          <MoreMenu
            items={[
              {
                label: 'Restart this puzzle',
                onClick: () => !solved && commit(restart(current)),
              },
              {
                label: 'New puzzle',
                onClick: () => saves.startRandom(saved.size),
              },
              ...(settings.allowReveal && !solved
                ? [
                    {
                      label: 'Reveal letter',
                      testId: 'menu_reveal_letter',
                      onClick: () => commit(revealLetter(current)),
                    },
                    {
                      label: 'Reveal word',
                      testId: 'menu_reveal_word',
                      onClick: () => commit(revealWord(current)),
                    },
                    {
                      label: 'Reveal puzzle',
                      onClick: () => setRevealing(true),
                    },
                  ]
                : []),
              {
                label: 'Settings',
                onClick: () =>
                  navigate([GAME_ROUTE.CROSSWORD, SCREEN.SETTINGS]),
              },
            ]}
          />
        </ScreenHeader>
      </div>
      <div className="flex w-full flex-col items-center gap-3 lg:flex-row lg:items-start">
        <div className="flex w-full max-w-xl flex-col gap-3 lg:max-w-[min(36rem,calc(100dvh-8rem))]">
          <div className="relative w-full">
            <CrosswordInput
              ref={inputRef}
              onKey={(press) => {
                const next = pressKey({ game: current, ...press })
                if (next === null) {
                  return false
                }
                commit(next)
                return true
              }}
              onText={(value) => commit(applyInput({ game: current, value }))}
            />
            <CrosswordBoard
              puzzle={current.puzzle}
              entries={current.entries}
              selected={current.selected}
              wordCells={new Set(word.cells)}
              wrong={settings.showMistakes ? wrongCells(current) : new Set()}
              onCell={(cell) => {
                commit(tapCell({ game: current, cell }))
                focusInput()
              }}
            />
          </div>
          <CrosswordClueBar
            label={`${word.number} ${word.isAcross ? 'Across' : 'Down'}`}
            clue={clueOf(word)}
            onStep={(step) => {
              commit(nextClue({ game: current, step }))
              focusInput()
            }}
          />
          <p className="h-6 text-sm font-semibold" role="status">
            {hint?.message ?? ''}
          </p>
        </div>
        <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
          {[true, false].map((isAcross) => (
            <CrosswordClueList
              key={String(isAcross)}
              title={isAcross ? 'Across' : 'Down'}
              words={current.puzzle.words.filter(
                (it) => it.isAcross === isAcross,
              )}
              current={word}
              clueOf={clueOf}
              onWord={(target) => {
                commit(selectWord({ game: current, word: target }))
                focusInput()
              }}
            />
          ))}
        </div>
      </div>
      <RevealDialog
        open={revealing}
        onClose={() => setRevealing(false)}
        onReveal={() => revealSaved(revealSolution(current))}
      />
      <WinDialog
        open={result !== null}
        title="Solved!"
        accent={MENU_ACCENT.CROSSWORD}
        route={GAME_ROUTE.CROSSWORD}
        share={puzzleWinShare({
          name: DEFINITION.name,
          games: saves.games,
          options: OPTIONS,
          puzzleId: saved.puzzleId,
          dayOf: (ms) => todayIso(new Date(ms)),
        })}
        newLabel={crosswordSizeLabel(saved.size)}
        onNew={() => saves.startRandom(saved.size)}
        newBest={result?.newBest ?? false}
        stats={[{ label: 'Time', value: formatDuration(elapsedMs()) }]}
        onClose={() => setResult(null)}
        actions={
          <Button onClick={() => navigate([GAME_ROUTE.CROSSWORD])}>Home</Button>
        }
      />
      <CustomiseHelpers route={GAME_ROUTE.CROSSWORD} />
    </main>
  )
}
