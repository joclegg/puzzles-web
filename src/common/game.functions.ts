import { GAMES } from '@/common/game.constants'
import type { GameDefinition } from '@/common/game.types'

export function gameById(id: string | undefined): GameDefinition | undefined {
  return GAMES.find((game) => game.id === id)
}
