import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import {
  addMonths,
  monthDays,
  monthLabel,
} from '@/common/dailyCalendar.functions'
import { MEDAL } from '@/common/dailyMedal.constants'
import { dailyDays } from '@/common/dailyMedal.functions'
import type { DailyResult, Medal } from '@/common/dailyMedal.types'
import { todayIso } from '@/common/date.functions'
import type { GAME_ROUTE } from '@/common/route.constants'
import { cn } from '@/common/utils.functions'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { MedalBadge } from '@/components/MedalBadge/MedalBadge'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import type { MenuAccent } from '@/components/MenuScreen/MenuScreen.types'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function DailyCalendar({
  accent,
  route,
  results,
  total,
  firstMedal = MEDAL.BRONZE,
  choices,
}: {
  accent: MenuAccent
  route: (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
  results: DailyResult[]
  total: number
  firstMedal?: Medal
  choices: (date: string) => {
    label: string
    done: boolean
    onPlay: () => void
  }[]
}) {
  const today = todayIso()
  const [month, setMonth] = useState(today.slice(0, 7))
  const [picked, setPicked] = useState<string | null>(null)
  const days = dailyDays({
    results,
    total,
    firstMedal,
    dayOf: (ms) => todayIso(new Date(ms)),
  })
  return (
    <MenuScreen accent={accent}>
      <ScreenHeader title="Daily calendar" back={[route]} />
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
          const description =
            medal !== MEDAL.NONE
              ? `${medal} medal`
              : day?.doneLate
                ? 'done later'
                : 'not done'
          return (
            <button
              key={date}
              type="button"
              disabled={date > today}
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
      <AppDialog
        open={picked !== null}
        title={picked ?? ''}
        onClose={() => setPicked(null)}
        actions={<Button onClick={() => setPicked(null)}>Close</Button>}
      >
        <div className="flex flex-wrap gap-2">
          {picked !== null &&
            choices(picked).map((choice) => (
              <Button
                key={choice.label}
                variant={BUTTON_VARIANT.OUTLINE}
                onClick={() => {
                  setPicked(null)
                  choice.onPlay()
                }}
              >
                {choice.label}
                {choice.done ? ' ✓' : ''}
              </Button>
            ))}
        </div>
      </AppDialog>
    </MenuScreen>
  )
}
