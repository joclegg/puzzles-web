import { GAMES } from '@/common/game.constants'
import type { GameDefinition } from '@/common/game.types'
import type { GameRoute } from '@/components/AllGames/AllGames.types'

export function gameById(id: string | undefined): GameDefinition | undefined {
  return GAMES.find((game) => game.id === id)
}

export function gameDefinition(id: GameRoute): GameDefinition {
  const definition = gameById(id)
  if (!definition) {
    throw new Error(`Unknown game ${id}`)
  }
  return definition
}
