import type { ReactNode } from 'react'

export function GameCard({
  title,
  detail,
  href,
  icon,
}: {
  title: string
  detail: string
  href: string
  icon: ReactNode
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-border transition-colors hover:bg-muted"
    >
      <span className="flex size-12 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span>
        <span className="block text-lg font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{detail}</span>
      </span>
    </a>
  )
}
