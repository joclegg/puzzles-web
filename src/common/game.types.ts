import type { ComponentType, LazyExoticComponent } from 'react'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'

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

export interface PuzzleOptions<T extends number | string> {
  filterName: string
  values: readonly T[]
  label: (value: T) => string
  filterLabel: (value: T) => string
  of: (game: SavedPuzzle) => T
  dailyId: (choice: { date: string; value: T }) => string
  title: (game: SavedPuzzle) => string
}
