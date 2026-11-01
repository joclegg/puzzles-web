import { SlidersHorizontal } from 'lucide-react'

import { SCREEN } from '@/common/route.constants'
import { routeHash } from '@/common/route.functions'
import type { DailyLeft } from '@/components/DailiesLeft/DailiesLeft.types'

export function CustomiseHelpers({ route }: { route: DailyLeft['route'] }) {
  return (
    <a
      href={routeHash([route, SCREEN.SETTINGS])}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground ring-1 ring-border transition-colors hover:text-game hover:ring-game/50"
    >
      <SlidersHorizontal aria-hidden className="size-3.5" />
      Customise helpers
    </a>
  )
}
