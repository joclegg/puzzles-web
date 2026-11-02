import type { ReactNode } from 'react'

import type { GameDefinition } from '@/shared/game/game.types'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function PuzzleStatsView({
  definition,
  title = 'Stats',
  children,
}: {
  definition: GameDefinition
  title?: string
  children: ReactNode
}) {
  return (
    <MenuScreen accent={definition.accent}>
      <ScreenHeader title={title} back={[definition.id]} />
      {children}
    </MenuScreen>
  )
}
