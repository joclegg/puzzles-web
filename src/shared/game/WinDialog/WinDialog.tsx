import { Dialog } from '@base-ui/react/dialog'
import { BookOpen, Trophy } from 'lucide-react'
import type { ReactNode } from 'react'

import { todayIso } from '@/shared/lib/date.functions'
import { GAMES_KEY as FIVE_LETTERS_KEY } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import { GAMES_KEY as KAKURO_KEY } from '@/games/kakuro/engine/kakuroSaves.constants'
import { SCREEN } from '@/shared/lib/route.constants'
import { routeHash } from '@/shared/lib/route.functions'
import { GAMES_KEY as SIGHTLINES_KEY } from '@/games/sightlines/engine/sightlinesSaves.constants'
import { GAMES_KEY as SLIDE_OUT_KEY } from '@/games/slideOut/engine/slideOutSaves.constants'
import { GAMES_KEY as SOLITAIRE_KEY } from '@/games/solitaire/engine/solitaireSaves.constants'
import { readStored } from '@/shared/storage/storage.functions'
import type { GameMode } from '@/games/sudoku/engine/sudoku.types'
import { GAMES_KEY as SUDOKU_KEY } from '@/games/sudoku/engine/sudokuSaves.constants'
import { GAMES_KEY as TWO_TONE_KEY } from '@/games/twoTone/engine/twoToneSaves.constants'
import { cn } from '@/shared/lib/utils.functions'
import { GAMES_KEY as WORD_WHEEL_KEY } from '@/games/wordWheel/engine/wordWheelSaves.constants'
import { AllGoldsBanner } from '@/shared/screens/AllGoldsBanner/AllGoldsBanner'
import { dailiesLeft } from '@/shared/screens/DailiesLeft/DailiesLeft.functions'
import type { DailyLeft } from '@/shared/screens/DailiesLeft/DailiesLeft.types'
import { MENU_ACCENT_CLASS } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import type { MenuAccent } from '@/shared/screens/MenuScreen/MenuScreen.types'
import {
  WIN_TILE_CAPTION_CLASS,
  WIN_TILE_CLASS,
} from '@/shared/game/WinDialog/WinDialog.constants'

export function WinDialog({
  open,
  title,
  accent,
  route,
  mode,
  newLabel,
  onNew,
  newBest,
  stats,
  message,
  lost = false,
  onClose,
  actions,
}: {
  open: boolean
  title: string
  accent: MenuAccent
  route: DailyLeft['route']
  mode?: GameMode
  newLabel?: string
  onNew?: () => void
  newBest: boolean
  stats: readonly { label: string; value: string | number }[]
  message?: string
  lost?: boolean
  onClose: () => void
  actions: ReactNode
}) {
  const left = open
    ? dailiesLeft({ today: todayIso(), saves: readSaves(), route, mode })
    : []
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-game/30 transition duration-300 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0',
            MENU_ACCENT_CLASS[accent],
          )}
        >
          <div className="relative isolate overflow-hidden bg-linear-to-b from-game/25 via-game/10 to-transparent px-5 pt-6 pb-4 text-center">
            <span
              aria-hidden
              className="absolute -top-16 left-1/2 -z-10 size-48 -translate-x-1/2 rounded-full bg-game/30 blur-3xl"
            />
            <span className="relative mx-auto flex size-16 items-center justify-center">
              <span
                aria-hidden
                className={cn(
                  'absolute inset-0 rounded-full bg-game/30',
                  !lost && 'animate-ping [animation-iteration-count:2]',
                )}
              />
              <span className="relative flex size-16 items-center justify-center rounded-full bg-game text-background shadow-lg">
                {lost ? (
                  <BookOpen className="size-8" strokeWidth={2.25} />
                ) : (
                  <Trophy className="size-8" strokeWidth={2.25} />
                )}
              </span>
            </span>
            <Dialog.Title className="mt-3 text-2xl font-bold">
              {title}
            </Dialog.Title>
            {newBest && (
              <p className="mt-1 inline-block rounded-full bg-game px-3 py-0.5 text-xs font-bold tracking-wide text-background uppercase">
                New best
              </p>
            )}
          </div>
          {!lost && <AllGoldsBanner />}
          {message && (
            <p className="px-5 pb-3 text-center text-sm text-muted-foreground">
              {message}
            </p>
          )}
          <dl className="grid auto-cols-fr grid-flow-col gap-2 px-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-game/8 px-2 py-2 text-center ring-1 ring-game/15"
              >
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          {(left.length > 0 || onNew) && (
            <nav aria-label="Play next" className="mt-4 px-5">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Play next
              </h3>
              <ul className="mt-2 grid grid-cols-3 gap-2">
                {left.map((daily) => (
                  <li key={daily.play}>
                    <a
                      href={routeHash([daily.route, SCREEN.PLAY, daily.play])}
                      onClick={onClose}
                      aria-label={`Daily ${daily.label}`}
                      className={WIN_TILE_CLASS}
                    >
                      <span className={WIN_TILE_CAPTION_CLASS}>Daily</span>
                      {daily.label}
                    </a>
                  </li>
                ))}
                {onNew && (
                  <li>
                    <button
                      type="button"
                      onClick={onNew}
                      aria-label={`New ${newLabel}`}
                      className={WIN_TILE_CLASS}
                    >
                      <span className={WIN_TILE_CAPTION_CLASS}>New</span>
                      {newLabel}
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2 px-5 pb-5">
            {actions}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function readSaves() {
  return {
    twoTone: readStored({ key: TWO_TONE_KEY, fallback: [] }),
    sightlines: readStored({ key: SIGHTLINES_KEY, fallback: [] }),
    kakuro: readStored({ key: KAKURO_KEY, fallback: [] }),
    slideOut: readStored({ key: SLIDE_OUT_KEY, fallback: [] }),
    wordWheel: readStored({ key: WORD_WHEEL_KEY, fallback: [] }),
    sudoku: readStored({ key: SUDOKU_KEY, fallback: [] }),
    solitaire: readStored({ key: SOLITAIRE_KEY, fallback: [] }),
    fiveLetters: readStored({ key: FIVE_LETTERS_KEY, fallback: [] }),
  }
}
