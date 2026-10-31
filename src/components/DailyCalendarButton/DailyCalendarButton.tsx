import { CalendarDays } from 'lucide-react'

import { MEDAL } from '@/common/dailyMedal.constants'
import { dailyDays } from '@/common/dailyMedal.functions'
import type { DailyResult, Medal } from '@/common/dailyMedal.types'
import { todayIso } from '@/common/date.functions'
import type { GAME_ROUTE } from '@/common/route.constants'
import { SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { cn } from '@/common/utils.functions'
import { Button } from '@/components/Button/Button'
import { BUTTON_SIZE } from '@/components/Button/Button.constants'
import { MEDAL_ICON_CLASS } from '@/components/DailyCalendarButton/DailyCalendarButton.constants'

export function DailyCalendarButton({
  route,
  results,
  total,
  firstMedal = MEDAL.BRONZE,
}: {
  route: (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
  results: DailyResult[]
  total: number
  firstMedal?: Medal
}) {
  const medal =
    dailyDays({
      results,
      total,
      firstMedal,
      dayOf: (ms) => todayIso(new Date(ms)),
    }).get(todayIso())?.medal ?? MEDAL.NONE
  return (
    <Button
      size={BUTTON_SIZE.ICON}
      aria-label="Daily calendar"
      onClick={() => navigate([route, SCREEN.DAILY])}
    >
      <CalendarDays className={cn('size-5', MEDAL_ICON_CLASS[medal])} />
    </Button>
  )
}
