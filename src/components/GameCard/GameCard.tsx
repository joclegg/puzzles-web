import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/common/utils.functions'
import { MENU_ACCENT_CLASS } from '@/components/MenuScreen/MenuScreen.constants'
import type { MenuAccent } from '@/components/MenuScreen/MenuScreen.types'

export function GameCard({
  title,
  detail,
  href,
  icon,
  accent,
}: {
  title: string
  detail: string
  href: string
  icon: ReactNode
  accent: MenuAccent
}) {
  return (
    <a
      href={href}
      className={cn(
        'group relative isolate flex items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-game/15 via-game/5 to-transparent p-4 text-card-foreground ring-1 ring-game/20 transition hover:ring-game/50 active:scale-[0.98]',
        MENU_ACCENT_CLASS[accent],
      )}
    >
      <span
        aria-hidden
        className="absolute -top-12 -right-10 -z-10 size-32 rounded-full bg-game/15 blur-3xl"
      />
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{detail}</span>
      </span>
      <ChevronRight
        aria-hidden
        className="size-5 shrink-0 text-game transition group-hover:translate-x-0.5"
      />
    </a>
  )
}
