import type { ReactNode } from 'react'

export function GameHero({
  icon,
  tagline,
}: {
  icon: ReactNode
  tagline: string
}) {
  return (
    <section className="relative isolate flex items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-game/15 via-game/5 to-transparent p-4 ring-1 ring-game/20">
      <span
        aria-hidden
        className="absolute -top-12 -right-10 -z-10 size-40 rounded-full bg-game/15 blur-3xl"
      />
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border">
        {icon}
      </span>
      <p className="text-sm text-balance text-muted-foreground">{tagline}</p>
    </section>
  )
}
