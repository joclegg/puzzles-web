import type { GAME_ROUTE } from '@/shared/lib/route.constants'

export type GameRoute = (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
