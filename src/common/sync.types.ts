import type {
  SIGN_IN_PROVIDER,
  SIGN_IN_STEP,
  SYNC_KIND,
} from '@/common/sync.constants'

export interface Account {
  email: string | null
  onDeleteAccount: () => Promise<boolean>
}

export interface SavedGameRow {
  game: string
  id: string
  data: unknown
  updated_at: string
  deleted: boolean
}

export interface SettingsRow {
  game: string
  data: unknown
  updated_at: string
}

export type SignInProvider =
  (typeof SIGN_IN_PROVIDER)[keyof typeof SIGN_IN_PROVIDER]

export type SignInStep = (typeof SIGN_IN_STEP)[keyof typeof SIGN_IN_STEP]

export interface SyncedEntry {
  id: string
  status?: string
}

export interface SyncedKey {
  game: string
  kind: SyncKind
}

export interface SyncedRow {
  synced_at: string
}

export type SyncKind = (typeof SYNC_KIND)[keyof typeof SYNC_KIND]
