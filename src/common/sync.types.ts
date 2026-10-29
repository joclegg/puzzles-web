import type { SYNC_KIND } from '@/common/sync.constants'

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

export interface SyncedEntry {
  id: string
}

export interface SyncedKey {
  game: string
  kind: SyncKind
}

export interface SyncedRow {
  synced_at: string
}

export type SyncKind = (typeof SYNC_KIND)[keyof typeof SYNC_KIND]
