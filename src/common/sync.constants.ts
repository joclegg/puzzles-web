export const PENDING_KEY = 'sync.pending'
export const STAMPS_KEY = 'sync.stamps'
export const STORED_EVENT = 'puzzles:stored'
export const SUPABASE_KEY = 'sb_publishable_gQgbll0ElIbV41OtkvuXlQ_yUegn2hH'
export const SUPABASE_URL = 'https://nrlmaucpuesfmvqhtupe.supabase.co'
export const PUSH_DELAY_MS = 1000

export const SYNCED_GAMES = [
  'fiveLetters',
  'kakuro',
  'sightlines',
  'slideOut',
  'solitaire',
  'sudoku',
  'twoTone',
  'wordWheel',
] as const

export const SYNC_KIND = {
  GAMES: 'games',
  SETTINGS: 'settings',
} as const
