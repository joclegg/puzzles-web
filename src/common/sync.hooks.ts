import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'

import { readStored, replaceStored } from '@/common/storage.functions'
import {
  PENDING_KEY,
  PUSH_DELAY_MS,
  STAMPS_KEY,
  STORED_EVENT,
  SUPABASE_KEY,
  SUPABASE_URL,
  SYNC_KIND,
  SYNCED_GAMES,
} from '@/common/sync.constants'
import {
  entryStampKey,
  mergeGames,
  mergeSettings,
  parseStampKey,
  settingsStampKey,
} from '@/common/sync.functions'
import type {
  SavedGameRow,
  SettingsRow,
  SyncedEntry,
} from '@/common/sync.types'

export function useSync() {
  const [client] = useState(() =>
    createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { flowType: 'pkce', detectSessionInUrl: true },
    }),
  )
  const [user, setUser] = useState<User | null>(null)
  const [version, setVersion] = useState(0)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (new URLSearchParams(window.location.search).has('code')) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.hash,
        )
      }
    })
    return () => data.subscription.unsubscribe()
  }, [client])

  useEffect(() => {
    if (user === null) return
    let active = true
    function schedulePush() {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        void push(client)
      }, PUSH_DELAY_MS)
    }
    void pull(client).then((changed) => {
      if (!active) return
      if (changed) setVersion((current) => current + 1)
      void push(client)
    })
    window.addEventListener(STORED_EVENT, schedulePush)
    window.addEventListener('online', schedulePush)
    return () => {
      active = false
      window.clearTimeout(timerRef.current)
      window.removeEventListener(STORED_EVENT, schedulePush)
      window.removeEventListener('online', schedulePush)
    }
  }, [client, user])

  const signIn = useCallback(() => {
    void client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    })
  }, [client])

  const signOut = useCallback(() => {
    void client.auth.signOut()
  }, [client])

  return { user, version, signIn, signOut }
}

async function pull(client: SupabaseClient) {
  const [saved, settings] = await Promise.all([
    client.from('saved_games').select('game, id, data, updated_at, deleted'),
    client.from('game_settings').select('game, data, updated_at'),
  ])
  if (saved.error !== null || settings.error !== null) return false
  const rows = saved.data as SavedGameRow[]
  const settingsRows = settings.data as SettingsRow[]
  let stamps = readStored<Record<string, number>>({
    key: STAMPS_KEY,
    fallback: {},
  })
  const pending = new Set(
    readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
  )
  let changed = false
  for (const game of SYNCED_GAMES) {
    const gamesKey = `${game}.${SYNC_KIND.GAMES}`
    const mergedGames = mergeGames({
      game,
      games: readStored<SyncedEntry[]>({ key: gamesKey, fallback: [] }),
      rows,
      stamps,
    })
    stamps = mergedGames.stamps
    for (const id of mergedGames.unstamped) {
      const key = entryStampKey({ game, id })
      stamps = { ...stamps, [key]: Date.now() }
      pending.add(key)
    }
    if (mergedGames.changed) {
      replaceStored({ key: gamesKey, value: mergedGames.games })
      changed = true
    }
    const settingsKey = `${game}.${SYNC_KIND.SETTINGS}`
    const mergedSettings = mergeSettings({
      game,
      settings: readStored<unknown>({ key: settingsKey, fallback: null }),
      row: settingsRows.find((row) => row.game === game),
      stamps,
    })
    stamps = mergedSettings.stamps
    if (mergedSettings.unstamped) {
      const key = settingsStampKey(game)
      stamps = { ...stamps, [key]: Date.now() }
      pending.add(key)
    }
    if (mergedSettings.changed) {
      replaceStored({ key: settingsKey, value: mergedSettings.settings })
      changed = true
    }
  }
  replaceStored({ key: STAMPS_KEY, value: stamps })
  replaceStored({ key: PENDING_KEY, value: [...pending] })
  return changed
}

async function push(client: SupabaseClient) {
  const pending = readStored<string[]>({ key: PENDING_KEY, fallback: [] })
  if (pending.length === 0) return
  const stamps = readStored<Record<string, number>>({
    key: STAMPS_KEY,
    fallback: {},
  })
  const savedRows: SavedGameRow[] = []
  const settingsRows: SettingsRow[] = []
  for (const key of pending) {
    const { game, kind, id } = parseStampKey(key)
    const updatedAt = new Date(stamps[key] ?? Date.now()).toISOString()
    if (kind === SYNC_KIND.GAMES && id !== null) {
      const entry = readStored<SyncedEntry[]>({
        key: `${game}.${SYNC_KIND.GAMES}`,
        fallback: [],
      }).find((it) => it.id === id)
      savedRows.push({
        game,
        id,
        data: entry ?? {},
        updated_at: updatedAt,
        deleted: entry === undefined,
      })
    } else {
      settingsRows.push({
        game,
        data: readStored<unknown>({
          key: `${game}.${SYNC_KIND.SETTINGS}`,
          fallback: {},
        }),
        updated_at: updatedAt,
      })
    }
  }
  const [saved, settings] = await Promise.all([
    savedRows.length > 0
      ? client.from('saved_games').upsert(savedRows)
      : Promise.resolve({ error: null }),
    settingsRows.length > 0
      ? client.from('game_settings').upsert(settingsRows)
      : Promise.resolve({ error: null }),
  ])
  if (saved.error !== null || settings.error !== null) return
  const latest = readStored<Record<string, number>>({
    key: STAMPS_KEY,
    fallback: {},
  })
  replaceStored({
    key: PENDING_KEY,
    value: readStored<string[]>({ key: PENDING_KEY, fallback: [] }).filter(
      (key) => !pending.includes(key) || latest[key] !== stamps[key],
    ),
  })
}
