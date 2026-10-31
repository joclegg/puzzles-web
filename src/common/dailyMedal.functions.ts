import { MEDAL } from '@/common/dailyMedal.constants'
import type { DailyDay, DailyResult, Medal } from '@/common/dailyMedal.types'

export function dailyDays({
  results,
  total,
  firstMedal = MEDAL.BRONZE,
  dayOf,
}: {
  results: DailyResult[]
  total: number
  firstMedal?: Medal
  dayOf: (ms: number) => string
}): Map<string, DailyDay> {
  const onTheDay = new Map<string, Set<string>>()
  const dates = new Set<string>()
  for (const result of results) {
    dates.add(result.date)
    if (
      result.finishedAt !== null &&
      dayOf(result.finishedAt) === result.date
    ) {
      onTheDay.set(
        result.date,
        (onTheDay.get(result.date) ?? new Set<string>()).add(result.id),
      )
    }
  }
  return new Map(
    [...dates].map((date) => {
      const medal = medalFor({
        count: onTheDay.get(date)?.size ?? 0,
        total,
        firstMedal,
      })
      return [date, { date, medal, doneLate: medal === MEDAL.NONE }]
    }),
  )
}

export function medalFor({
  count,
  total,
  firstMedal = MEDAL.BRONZE,
}: {
  count: number
  total: number
  firstMedal?: Medal
}): Medal {
  if (count === 0) {
    return MEDAL.NONE
  }
  if (count >= total) {
    return MEDAL.GOLD
  }
  return count === 1 ? firstMedal : MEDAL.SILVER
}
