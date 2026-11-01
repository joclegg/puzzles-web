import { MEDAL } from '@/shared/game/dailyMedal.constants'
import type { Medal } from '@/shared/game/dailyMedal.types'
import { cn } from '@/shared/lib/utils.functions'
import { MEDAL_CLASS } from '@/shared/screens/MedalBadge/MedalBadge.constants'

export function MedalBadge({ medal }: { medal: Medal }) {
  if (medal === MEDAL.NONE) {
    return null
  }
  return (
    <span
      aria-hidden
      className={cn('inline-block size-3 rounded-full', MEDAL_CLASS[medal])}
    />
  )
}
