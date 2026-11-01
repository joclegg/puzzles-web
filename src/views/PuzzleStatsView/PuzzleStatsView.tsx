import type { ReactNode } from 'react'

import type { GameDefinition } from '@/common/game.types'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

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
