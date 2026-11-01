import type { ReactNode } from 'react'

import type { GameDefinition } from '@/shared/game/game.types'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function PuzzleStatsView({
  definition,
  children,
}: {
  definition: GameDefinition
  children: ReactNode
}) {
  return (
    <MenuScreen accent={definition.accent}>
      <ScreenHeader title="Stats" back={[definition.id]} />
      {children}
    </MenuScreen>
  )
}
