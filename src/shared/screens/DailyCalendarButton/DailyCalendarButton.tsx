import { CalendarDays } from 'lucide-react'

import { MEDAL } from '@/shared/game/dailyMedal.constants'
import { dailyDays } from '@/shared/game/dailyMedal.functions'
import type { DailyResult, Medal } from '@/shared/game/dailyMedal.types'
import { todayIso } from '@/shared/lib/date.functions'
import type { GAME_ROUTE } from '@/shared/lib/route.constants'
import { SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { cn } from '@/shared/lib/utils.functions'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { MEDAL_ICON_CLASS } from '@/shared/screens/DailyCalendarButton/DailyCalendarButton.constants'

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
