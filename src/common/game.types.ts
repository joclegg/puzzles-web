import type { ComponentType, LazyExoticComponent } from 'react'

import type { GameRoute } from '@/components/AllGames/AllGames.types'
import type { MenuAccent } from '@/components/MenuScreen/MenuScreen.types'

export interface GameDefinition {
  id: GameRoute
  name: string
  accent: MenuAccent
  bankPaths: readonly string[]
  screens: readonly string[]
  View: LazyExoticComponent<ComponentType<GameViewProps>>
}

export interface GameViewProps {
  screen: string
  id: string
}
