import { MEDAL } from '@/common/dailyMedal.constants'
import type { Medal } from '@/common/dailyMedal.types'
import { cn } from '@/common/utils.functions'
import { MEDAL_CLASS } from '@/components/MedalBadge/MedalBadge.constants'

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
