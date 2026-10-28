import { SYNC_KIND, SYNCED_GAMES } from '@/common/sync.constants'
import type {
  SavedGameRow,
  SettingsRow,
  SyncedEntry,
  SyncedKey,
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

export function entryStampKey({ game, id }: { game: string; id: string }) {
  return `${game}.${SYNC_KIND.GAMES}/${id}`
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
