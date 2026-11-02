import {
  PENDING_KEY,
  STAMPS_KEY,
  STORED_EVENT,
  SYNC_KIND,
} from '@/shared/sync/sync.constants'
import {
  changedEntryIds,
  entryStampKey,
  isProgressOnly,
  recordChanges,
  settingsStampKey,
  syncedKey,
} from '@/shared/sync/sync.functions'
import type { SyncedEntry } from '@/shared/sync/sync.types'

export function readStored<T>({ key, fallback }: { key: string; fallback: T }) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null
      ? fallback
      : withDefaults({ stored: JSON.parse(stored) as T, fallback })
  } catch {
    return fallback
  }
}

export function replaceStored<T>({ key, value }: { key: string; value: T }) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function withDefaults<T>({
  stored,
  fallback,
}: {
  stored: T
  fallback: T
}) {
  return isPlainObject(stored) && isPlainObject(fallback)
    ? { ...fallback, ...stored }
    : stored
}

export function writeStored<T>({ key, value }: { key: string; value: T }) {
  const synced = syncedKey(key)
  if (synced === null) {
    replaceStored({ key, value })
    return
  }
  const before = readStored<SyncedEntry[]>({ key, fallback: [] })
  const keys =
    synced.kind === SYNC_KIND.GAMES
      ? changedEntryIds({
          before,
          after: value as SyncedEntry[],
        }).map((id) => entryStampKey({ game: synced.game, id }))
      : [settingsStampKey(synced.game)]
  const recorded = recordChanges({
    stamps: readStored<Record<string, number>>({
      key: STAMPS_KEY,
      fallback: {},
    }),
    pending: readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
    keys,
    now: Date.now(),
  })
  replaceStored({ key: STAMPS_KEY, value: recorded.stamps })
  replaceStored({ key: PENDING_KEY, value: recorded.pending })
  replaceStored({ key, value })
  const moveOnly =
    synced.kind === SYNC_KIND.GAMES &&
    isProgressOnly({ before, after: value as SyncedEntry[] })
  if (!moveOnly) window.dispatchEvent(new Event(STORED_EVENT))
}

function isPlainObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
