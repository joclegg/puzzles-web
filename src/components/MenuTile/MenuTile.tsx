import { Check, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/common/utils.functions'

export function MenuTile({
  label,
  detail,
  icon,
  meter,
  done = false,
  active = false,
  disabled = false,
  ariaLabel,
  onClick,
}: {
  label: string
  detail?: string
  icon?: ReactNode
  meter?: ReactNode
  done?: boolean
  active?: boolean
  disabled?: boolean
  ariaLabel?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group flex min-h-16 w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left ring-1 ring-border transition hover:bg-muted hover:ring-game/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        (done || active) && 'ring-game/40',
      )}
    >
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-game/12 text-game">
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-semibold">{label}</span>
        {meter}
        {detail && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {active && (
              <span aria-hidden className="size-1.5 rounded-full bg-game" />
            )}
            {detail}
          </span>
        )}
      </span>
      {done ? (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-game text-background">
          <Check className="size-4" strokeWidth={3} aria-label="Done" />
        </span>
      ) : (
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </button>
  )
}
