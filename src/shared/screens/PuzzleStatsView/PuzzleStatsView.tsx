import type { ReactNode } from 'react'

import type { GameDefinition } from '@/shared/game/game.types'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { ShareButton } from '@/shared/ui/ShareButton/ShareButton'

export function PuzzleStatsView({
  definition,
  title = 'Stats',
  share,
  children,
}: {
  definition: GameDefinition
  title?: string
  share: string
  children: ReactNode
}) {
  return (
    <MenuScreen accent={definition.accent}>
      <ScreenHeader title={title} back={[definition.id]}>
        <ShareButton label="Share your records" text={share} />
      </ScreenHeader>
      {children}
    </MenuScreen>
  )
}
