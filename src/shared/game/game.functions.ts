import { GAMES } from '@/games/games.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import type { GameRoute } from '@/shared/lib/route.types'

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
