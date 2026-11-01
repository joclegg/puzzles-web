import { Check } from 'lucide-react'

import { cn } from '@/shared/lib/utils.functions'

export function DailyTile({
  label,
  done,
  ariaLabel,
  onClick,
}: {
  label: string
  done: boolean
  ariaLabel: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={done ? `${ariaLabel}, done` : ariaLabel}
      onClick={onClick}
      className={cn(
        'flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center ring-1 transition active:scale-[0.97]',
        done
          ? 'bg-game/15 ring-game/40 hover:bg-game/20'
          : 'bg-card ring-border hover:bg-muted hover:ring-game/40',
      )}
    >
      <span className="text-sm leading-tight font-semibold">{label}</span>
      {done ? (
        <span className="flex size-4 items-center justify-center rounded-full bg-game text-background">
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </span>
      ) : (
        <span className="text-[0.7rem] text-muted-foreground">Play</span>
      )}
    </button>
  )
}
