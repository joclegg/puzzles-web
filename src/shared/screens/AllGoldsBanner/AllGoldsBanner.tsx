import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { todayIso } from '@/shared/lib/date.functions'
import { readStored, replaceStored } from '@/shared/storage/storage.functions'
import { ALL_GOLDS_SHOWN_KEY } from '@/shared/game/AllGames/AllGames.constants'
import {
  hasAllGolds,
  todayMedals,
} from '@/shared/game/AllGames/AllGames.functions'
import { useAllSaves } from '@/shared/game/AllGames/AllGames.hooks'

export function AllGoldsBanner() {
  const saves = useAllSaves()
  const today = todayIso()
  const [shown] = useState(
    () =>
      readStored<string | null>({
        key: ALL_GOLDS_SHOWN_KEY,
        fallback: null,
      }) !== today,
  )
  const golds = hasAllGolds(
    todayMedals({ saves, today, dayOf: (ms) => todayIso(new Date(ms)) }),
  )
  const show = shown && golds

  useEffect(() => {
    if (show) replaceStored({ key: ALL_GOLDS_SHOWN_KEY, value: today })
  }, [show, today])

  if (!show) {
    return null
  }
  return (
    <div
      role="status"
      className="flex items-center gap-3 bg-sd-gold/20 px-5 py-3 ring-1 ring-sd-gold/40"
    >
      <Trophy aria-hidden className="size-8 shrink-0 text-sd-gold" />
      <span>
        <span className="block font-bold">Gold in every puzzle</span>
        <span className="block text-sm text-muted-foreground">
          Every daily done today, in all eight games.
        </span>
      </span>
    </div>
  )
}
