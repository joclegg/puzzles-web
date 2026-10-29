import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/common/utils.functions'
import { todayIso } from '@/common/date.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { GAME_MODE_LABEL, GAME_MODES } from '@/common/sudoku/sudoku.constants'
import { useSudokuGames } from '@/common/sudoku/sudoku.hooks'
import type { GameMode } from '@/common/sudoku/sudoku.types'
import {
  addMonths,
  monthDays,
  monthLabel,
} from '@/common/sudoku/sudokuCalendar.functions'
import { DAILY_STATUS, MEDAL } from '@/common/sudoku/sudokuSaves.constants'
import { dailyDays } from '@/common/sudoku/sudokuSaves.functions'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { MedalBadge } from '@/components/MedalBadge/MedalBadge'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SudokuDailyView() {
  const { games, openDaily } = useSudokuGames()
  const today = todayIso()
  const [month, setMonth] = useState(today.slice(0, 7))
  const [picked, setPicked] = useState<string | null>(null)
  const days = dailyDays({ games, dayOf: (ms) => todayIso(new Date(ms)) })

  function play({ mode, date }: { mode: GameMode; date: string }) {
    setPicked(null)
    void openDaily({ mode, date })
  }

  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="Daily puzzles" back={[GAME_ROUTE.SUDOKU]} />
      <div className="flex items-center">
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Previous month"
          onClick={() => setMonth(addMonths({ month, count: -1 }))}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <h2 className="flex-1 text-center font-semibold">
          {monthLabel(month)}
        </h2>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Next month"
          disabled={month >= today.slice(0, 7)}
          onClick={() => setMonth(addMonths({ month, count: 1 }))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthDays(month).map((date, i) => {
          if (date === null) {
            return <span key={i} />
          }
          const day = days.get(date)
          const medal = day?.medal ?? MEDAL.NONE
          const future = date > today
          const description =
            medal === MEDAL.GOLD
              ? 'gold medal'
              : medal === MEDAL.SILVER
                ? 'silver medal'
                : day?.doneLate
                  ? 'done later'
                  : 'not done'
          return (
            <button
              key={date}
              type="button"
              disabled={future}
              aria-label={`${date}, ${description}`}
              onClick={() => setPicked(date)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm ring-1 ring-border disabled:opacity-30',
                date === today && 'ring-2 ring-primary',
              )}
            >
              {Number(date.slice(8))}
              <MedalBadge medal={medal} />
              {day?.doneLate && (
                <span className="absolute right-1 bottom-0.5 text-xs text-primary">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <MedalBadge medal={MEDAL.GOLD} /> Gold: both dailies on the day
        </li>
        <li className="flex items-center gap-2">
          <MedalBadge medal={MEDAL.SILVER} /> Silver: one daily on the day
        </li>
        <li className="flex items-center gap-2">
          <span className="text-primary">✓</span> Done on a later day
        </li>
      </ul>
      <AppDialog
        open={picked !== null}
        title={picked ?? ''}
        onClose={() => setPicked(null)}
        actions={
          <>
            <Button onClick={() => setPicked(null)}>Close</Button>
            {GAME_MODES.map((mode) => (
              <Button
                key={mode}
                variant={BUTTON_VARIANT.OUTLINE}
                onClick={() => play({ mode, date: picked! })}
              >
                {GAME_MODE_LABEL[mode]}
                {picked !== null &&
                days.get(picked)?.statuses[mode] !== undefined &&
                days.get(picked)?.statuses[mode] !== DAILY_STATUS.NOT_DONE
                  ? ' ✓'
                  : ''}
              </Button>
            ))}
          </>
        }
      >
        <p>Play this day's classic or killer puzzle.</p>
      </AppDialog>
    </MenuScreen>
  )
}
