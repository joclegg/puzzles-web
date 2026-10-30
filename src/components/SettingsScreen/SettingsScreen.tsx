import type { ReactNode } from 'react'

import { SCREEN } from '@/common/route.constants'
import { routeHash } from '@/common/route.functions'
import { cn } from '@/common/utils.functions'
import { MENU_ACCENT_CLASS } from '@/components/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SETTINGS_TABS } from '@/components/SettingsScreen/SettingsScreen.constants'

export function SettingsScreen({
  game,
  children,
}: {
  game: string
  children: ReactNode
}) {
  const current =
    SETTINGS_TABS.find((tab) => tab.route === game) ?? SETTINGS_TABS[0]
  return (
    <main
      className={cn(
        'mx-auto flex max-w-3xl flex-col px-4 pb-8',
        MENU_ACCENT_CLASS[current.accent],
      )}
    >
      <ScreenHeader title="Settings" back={[game]} />
      <nav
        aria-label="Games"
        className="sticky top-0 z-10 -mx-4 flex [scrollbar-width:none] gap-1 overflow-x-auto bg-background/90 px-4 py-2 backdrop-blur"
      >
        {SETTINGS_TABS.map((tab) => (
          <a
            key={tab.route}
            href={routeHash([tab.route, SCREEN.SETTINGS])}
            aria-current={tab.route === current.route ? 'page' : undefined}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-1 transition-colors',
              MENU_ACCENT_CLASS[tab.accent],
              tab.route === current.route
                ? 'bg-game text-background ring-game'
                : 'text-muted-foreground ring-border hover:text-game hover:ring-game/50',
            )}
          >
            {tab.label}
          </a>
        ))}
      </nav>
      <div className="mt-2 rounded-2xl bg-linear-to-b from-game/10 to-transparent px-4 pb-2 ring-1 ring-game/20">
        {children}
      </div>
    </main>
  )
}
