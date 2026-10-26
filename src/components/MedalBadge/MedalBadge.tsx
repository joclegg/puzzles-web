import { cn } from '@/common/utils.functions'
import { MEDAL } from '@/common/sudoku/sudokuSaves.constants'
import type { Medal } from '@/common/sudoku/sudokuSaves.types'

export function MedalBadge({ medal }: { medal: Medal }) {
  if (medal === MEDAL.NONE) {
    return null
  }
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-3 rounded-full',
        medal === MEDAL.GOLD ? 'bg-sd-gold' : 'bg-sd-silver',
      )}
    />
  )
}
