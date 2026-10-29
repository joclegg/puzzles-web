import type { ReactNode } from 'react'

export function Panel({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-2 rounded-2xl bg-card px-4 py-3 ring-1 ring-border"
    >
      {title && (
        <h2 className="flex items-center gap-2 pt-1 font-semibold">
          <span aria-hidden className="h-4 w-1 rounded-full bg-game" />
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
