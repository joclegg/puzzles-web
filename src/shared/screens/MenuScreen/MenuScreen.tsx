import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils.functions'
import { MENU_ACCENT_CLASS } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import type { MenuAccent } from '@/shared/screens/MenuScreen/MenuScreen.types'

export function MenuScreen({
  accent,
  className,
  children,
}: {
  accent: MenuAccent
  className?: string
  children: ReactNode
}) {
  return (
    <main
      className={cn(
        'mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-10',
        MENU_ACCENT_CLASS[accent],
        className,
      )}
    >
      {children}
    </main>
  )
}
