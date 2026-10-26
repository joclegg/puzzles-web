import type { ReactNode } from 'react'

import { BackButton } from '@/components/BackButton/BackButton'

export function ScreenHeader({
  title,
  subtitle,
  back,
  children,
}: {
  title: string
  subtitle?: string
  back: readonly (string | number)[]
  children?: ReactNode
}) {
  return (
    <header className="flex items-center gap-2 py-2">
      <BackButton to={back} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </header>
  )
}
