import {
  EMAIL_CODE_LENGTH,
  PULL_OVERLAP_MS,
  SYNC_KIND,
  SYNCED_GAMES,
} from '@/common/sync.constants'
import type {
  SavedGameRow,
  SettingsRow,
  SyncedEntry,
  SyncedKey,
  SyncedRow,
} from '@/common/sync.types'

export function changedEntryIds({
  before,
  after,
}: {
  before: SyncedEntry[]
  after: SyncedEntry[]
}): string[] {
  const previous = new Map(
    before.map((entry) => [entry.id, JSON.stringify(entry)]),
  )
  const current = new Set(after.map((entry) => entry.id))
  const changed = after
    .filter((entry) => previous.get(entry.id) !== JSON.stringify(entry))
    .map((entry) => entry.id)
  const removed = before
    .filter((entry) => !current.has(entry.id))
    .map((entry) => entry.id)
  return [...changed, ...removed]
}

export function cleanEmailCode(input: string): string {
  return input.replace(/\D/g, '').slice(0, EMAIL_CODE_LENGTH)
}

export function entryStampKey({ game, id }: { game: string; id: string }) {
  return `${game}.${SYNC_KIND.GAMES}/${id}`
}

export function isEmailAddress(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())
}

export function isProgressOnly({
  before,
  after,
}: {
  before: SyncedEntry[]
  after: SyncedEntry[]
}): boolean {
  const previous = new Map(before.map((entry) => [entry.id, entry.status]))
  return (
    before.length === after.length &&
    after.every(
      (entry) =>
        previous.has(entry.id) && previous.get(entry.id) === entry.status,
    )
  )
}

export function isSyncableKey(key: string): boolean {
  const { id } = parseStampKey(key)
  return id === null || isSyncableId(id)
}

export function mergeGames({
  game,
  games,
  rows,
  stamps,
}: {
  game: string
  games: SyncedEntry[]
  rows: SavedGameRow[]
  stamps: Record<string, number>
}): {
  games: SyncedEntry[]
  stamps: Record<string, number>
  changed: boolean
  unstamped: string[]
} {
  const byId = new Map(games.map((entry) => [entry.id, entry]))
  const nextStamps = { ...stamps }
  let changed = false
  for (const row of rows.filter((it) => it.game === game)) {
    const key = entryStampKey({ game, id: row.id })
    const remoteMs = Date.parse(row.updated_at)
    if (remoteMs <= (nextStamps[key] ?? -1)) continue
    nextStamps[key] = remoteMs
    if (row.deleted) {
      changed = byId.delete(row.id) || changed
    } else {
      byId.set(row.id, row.data as SyncedEntry)
      changed = true
    }
  }
  const unstamped = [...byId.keys()].filter(
    (id) => nextStamps[entryStampKey({ game, id })] === undefined,
  )
  return { games: [...byId.values()], stamps: nextStamps, changed, unstamped }
}

export function mergeSettings({
  game,
  settings,
  row,
  stamps,
}: {
  game: string
  settings: unknown
  row: SettingsRow | undefined
  stamps: Record<string, number>
}): {
  settings: unknown
  stamps: Record<string, number>
  changed: boolean
  unstamped: boolean
} {
  const key = settingsStampKey(game)
  const localMs = stamps[key]
  const remoteMs = row === undefined ? -1 : Date.parse(row.updated_at)
  if (row !== undefined && remoteMs > (localMs ?? -1)) {
    return {
      settings: row.data,
      stamps: { ...stamps, [key]: remoteMs },
      changed: true,
      unstamped: false,
    }
  }
  return {
    settings,
    stamps,
    changed: false,
    unstamped: settings !== null && localMs === undefined,
  }
}

export function parseStampKey(key: string): SyncedKey & { id: string | null } {
  const [storageKey, id = null] = key.split('/')
  const [game, kind] = storageKey.split('.')
  return {
    game,
    kind: kind === SYNC_KIND.GAMES ? SYNC_KIND.GAMES : SYNC_KIND.SETTINGS,
    id,
  }
}

export function pulledUpTo({
  cursor,
  rows,
}: {
  cursor: string | null
  rows: SyncedRow[]
}): string | null {
  return rows.reduce<string | null>(
    (latest, row) =>
      latest === null || Date.parse(row.synced_at) > Date.parse(latest)
        ? row.synced_at
        : latest,
    cursor,
  )
}

export function pullSince(cursor: string | null): string {
  return cursor === null
    ? new Date(0).toISOString()
    : new Date(Date.parse(cursor) - PULL_OVERLAP_MS).toISOString()
}

export function recordChanges({
  stamps,
  pending,
  keys,
  now,
}: {
  stamps: Record<string, number>
  pending: string[]
  keys: string[]
  now: number
}): { stamps: Record<string, number>; pending: string[] } {
  const nextStamps = { ...stamps }
  for (const key of keys) {
    nextStamps[key] = Math.max(now, (stamps[key] ?? 0) + 1)
  }
  return {
    stamps: nextStamps,
    pending: [...new Set([...pending, ...keys])],
  }
}

export function settingsStampKey(game: string) {
  return `${game}.${SYNC_KIND.SETTINGS}`
}

export function syncedKey(storageKey: string): SyncedKey | null {
  const [game, kind] = storageKey.split('.')
  const isGame = (SYNCED_GAMES as readonly string[]).includes(game)
  if (!isGame) return null
  if (kind === SYNC_KIND.GAMES) return { game, kind: SYNC_KIND.GAMES }
  if (kind === SYNC_KIND.SETTINGS) return { game, kind: SYNC_KIND.SETTINGS }
  return null
}

function isSyncableId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  )
}
