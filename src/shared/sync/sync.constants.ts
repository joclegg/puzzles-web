export const EMAIL_CODE_LENGTH = 8
export const PAGE_SIZE = 1000
export const PENDING_KEY = 'sync.pending'
export const PULL_OVERLAP_MS = 60_000
export const PULLED_KEY = 'sync.pulled'
export const RETRY_MS = 30_000
export const STAMPS_KEY = 'sync.stamps'
export const STORED_EVENT = 'puzzles:stored'
export const SYNCED_EVENT = 'puzzles:synced'
export const SUPABASE_KEY = 'sb_publishable_gQgbll0ElIbV41OtkvuXlQ_yUegn2hH'
export const SUPABASE_URL = 'https://nrlmaucpuesfmvqhtupe.supabase.co'
export const PUSH_DELAY_MS = 1000

export const SIGN_IN_PROVIDER = {
  GOOGLE: 'google',
  MICROSOFT: 'azure',
} as const

export const SIGN_IN_STEP = {
  CHOOSE: 'choose',
  CODE: 'code',
} as const

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
