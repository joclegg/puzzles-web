import { Fragment } from 'react'
import type { ReactNode } from 'react'

import { BackButton } from '@/shared/ui/BackButton/BackButton'

export function ScreenHeader({
  title,
  subtitle,
  back,
  children,
}: {
  title: string
  subtitle?: string | ReactNode[]
  back: readonly (string | number)[]
  children?: ReactNode
}) {
  const parts = (Array.isArray(subtitle) ? subtitle : [subtitle]).filter(
    (part) =>
      part !== null && part !== undefined && part !== false && part !== '',
  )
  return (
    <header className="flex items-center gap-2 py-2">
      <BackButton to={back} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold">{title}</h1>
        {parts.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {parts.map((part, index) => (
              <Fragment key={index}>
                {index > 0 && ' · '}
                {part}
              </Fragment>
            ))}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </header>
  )
}
