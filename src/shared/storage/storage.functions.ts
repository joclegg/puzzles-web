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
  return readStoredWithRaw({ key, fallback }).value
}

export function readStoredWithRaw<T>({
  key,
  fallback,
}: {
  key: string
  fallback: T
}): { value: T; raw: string | null } {
  try {
    const raw = localStorage.getItem(key)
    return {
      value:
        raw === null
          ? fallback
          : withDefaults({ stored: JSON.parse(raw) as T, fallback }),
      raw,
    }
  } catch {
    return { value: fallback, raw: null }
  }
}

export function replaceStored<T>({ key, value }: { key: string; value: T }) {
  writeRaw({ key, raw: JSON.stringify(value) })
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

export function writeStored<T>({
  key,
  value,
  previous,
}: {
  key: string
  value: T
  previous?: { value: T; raw: string | null }
}): string {
  const raw = JSON.stringify(value)
  const synced = syncedKey(key)
  if (synced === null) {
    writeRaw({ key, raw })
    return raw
  }
  const before =
    synced.kind === SYNC_KIND.GAMES ? previousEntries({ key, previous }) : []
  const keys =
    synced.kind === SYNC_KIND.GAMES
      ? changedEntryIds({
          before,
          after: value as SyncedEntry[],
        }).map((id) => entryStampKey({ game: synced.game, id }))
      : [settingsStampKey(synced.game)]
  const pending = readStored<string[]>({ key: PENDING_KEY, fallback: [] })
  const recorded = recordChanges({
    stamps: readStored<Record<string, number>>({
      key: STAMPS_KEY,
      fallback: {},
    }),
    pending,
    keys,
    now: Date.now(),
  })
  replaceStored({ key: STAMPS_KEY, value: recorded.stamps })
  if (!keys.every((it) => pending.includes(it))) {
    replaceStored({ key: PENDING_KEY, value: recorded.pending })
  }
  writeRaw({ key, raw })
  const moveOnly =
    synced.kind === SYNC_KIND.GAMES &&
    isProgressOnly({ before, after: value as SyncedEntry[] })
  if (!moveOnly) window.dispatchEvent(new Event(STORED_EVENT))
  return raw
}

function isPlainObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function previousEntries<T>({
  key,
  previous,
}: {
  key: string
  previous: { value: T; raw: string | null } | undefined
}): SyncedEntry[] {
  if (previous !== undefined && previous.raw !== null) {
    try {
      if (localStorage.getItem(key) === previous.raw) {
        return previous.value as SyncedEntry[]
      }
    } catch {
      return []
    }
  }
  return readStored<SyncedEntry[]>({ key, fallback: [] })
}

function writeRaw({ key, raw }: { key: string; raw: string }) {
  try {
    localStorage.setItem(key, raw)
  } catch {
    return
  }
}
