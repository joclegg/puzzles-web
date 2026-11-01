import { DEFAULT_ASSISTS } from '@/common/assists.constants'
import { DRAW_MODE } from '@/common/solitaire/solitaire.constants'
import type { SolitaireSettings } from '@/common/solitaire/solitaireSaves.types'

export const GAMES_KEY = 'solitaire.games'

export const SETTINGS_KEY = 'solitaire.settings'

export const DEAL_STATUS = {
  IN_PROGRESS: 'inProgress',
  WON: 'won',
  LOST: 'lost',
  ABANDONED: 'abandoned',
} as const

export const DEAL_STATUS_LABEL = {
  [DEAL_STATUS.IN_PROGRESS]: 'In progress',
  [DEAL_STATUS.WON]: 'Won',
  [DEAL_STATUS.LOST]: 'Lost',
  [DEAL_STATUS.ABANDONED]: 'Abandoned',
}

export const DEFAULT_SETTINGS: SolitaireSettings = {
  ...DEFAULT_ASSISTS,
  drawMode: DRAW_MODE.DRAW_ONE,
  reverse: false,
  oneTapMove: true,
  winnableOnly: true,
  warnUnwinnable: false,
  showTimer: true,
  showMoveCount: true,
}

export const DAILY_PREFIX = 'daily_'

export const RANDOM_SLOT = 'deal'

export const TITLE = 'Solitaire'
