import { Dialog } from '@base-ui/react/dialog'
import { BookOpen, ChevronRight, Trophy } from 'lucide-react'
import type { ReactNode } from 'react'

import { todayIso } from '@/common/date.functions'
import { GAMES_KEY as FIVE_LETTERS_KEY } from '@/common/fiveLetters/fiveLettersSaves.constants'
import { GAMES_KEY as KAKURO_KEY } from '@/common/kakuro/kakuroSettings.constants'
import { SCREEN } from '@/common/route.constants'
import { routeHash } from '@/common/route.functions'
import { GAMES_KEY as SIGHTLINES_KEY } from '@/common/sightlines/sightlinesSettings.constants'
import { GAMES_KEY as SLIDE_OUT_KEY } from '@/common/slideOut/slideOutSaves.constants'
import { GAMES_KEY as SOLITAIRE_KEY } from '@/common/solitaire/solitaireSaves.constants'
import { readStored } from '@/common/storage.functions'
import { GAMES_KEY as SUDOKU_KEY } from '@/common/sudoku/sudokuSaves.constants'
import { GAMES_KEY as TWO_TONE_KEY } from '@/common/twoTone/twoToneSettings.constants'
import { cn } from '@/common/utils.functions'
import { GAMES_KEY as WORD_WHEEL_KEY } from '@/common/wordWheel/wordWheelSaves.constants'
import { dailiesLeft } from '@/components/DailiesLeft/DailiesLeft.functions'
import { MENU_ACCENT_CLASS } from '@/components/MenuScreen/MenuScreen.constants'
import type { MenuAccent } from '@/components/MenuScreen/MenuScreen.types'

export function WinDialog({
  open,
  title,
  accent,
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
  newBest: boolean
  stats: readonly { label: string; value: string | number }[]
  message?: string
  lost?: boolean
  onClose: () => void
  actions: ReactNode
}) {
  const left = open
    ? dailiesLeft({ today: todayIso(), saves: readSaves() })
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
          {left.length > 0 && (
            <nav aria-label="Still to play today" className="mt-4 px-5">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Still to play today
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {left.map((daily) => (
                  <li key={`${daily.route}/${daily.play}`}>
                    <a
                      href={routeHash([daily.route, SCREEN.PLAY, daily.play])}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full bg-game/12 py-1 pr-2 pl-3 text-sm font-medium ring-1 ring-game/30 transition hover:bg-game/20',
                        MENU_ACCENT_CLASS[daily.accent],
                      )}
                    >
                      {daily.label}
                      <ChevronRight aria-hidden className="size-4 text-game" />
                    </a>
                  </li>
                ))}
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
