import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'

import { readStored, replaceStored } from '@/common/storage.functions'
import {
  PAGE_SIZE,
  PENDING_KEY,
  PULLED_KEY,
  PUSH_DELAY_MS,
  RETRY_MS,
  SIGN_IN_PROVIDER,
  STAMPS_KEY,
  STORED_EVENT,
  SUPABASE_KEY,
  SUPABASE_URL,
  SYNC_KIND,
  SYNCED_EVENT,
  SYNCED_GAMES,
} from '@/common/sync.constants'
import {
  entryStampKey,
  mergeGames,
  mergeSettings,
  parseStampKey,
  pulledUpTo,
  pullSince,
  settingsStampKey,
} from '@/common/sync.functions'
import type {
  SavedGameRow,
  SettingsRow,
  SignInProvider,
  SyncedEntry,
  SyncedRow,
} from '@/common/sync.types'

export function useSync() {
  const [client] = useState(() =>
    createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { flowType: 'pkce', detectSessionInUrl: true },
    }),
  )
  const [user, setUser] = useState<User | null>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const runningRef = useRef<Promise<void>>(Promise.resolve())
  const userId = user?.id ?? null

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
    if (userId === null) return
    let active = true
    function schedule(delayMs: number) {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(run, delayMs)
    }
    function run() {
      runningRef.current = runningRef.current.then(async () => {
        if (!active) return
        const synced = await syncOnce(client)
        if (!synced && active) schedule(RETRY_MS)
      })
    }
    function onStored() {
      schedule(PUSH_DELAY_MS)
    }
    function onVisible() {
      if (!document.hidden) run()
    }
    run()
    window.addEventListener(STORED_EVENT, onStored)
    window.addEventListener('online', run)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      window.clearTimeout(timerRef.current)
      window.removeEventListener(STORED_EVENT, onStored)
      window.removeEventListener('online', run)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [client, userId])

  const signIn = useCallback(
    (provider: SignInProvider) => {
      void client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          scopes: provider === SIGN_IN_PROVIDER.MICROSOFT ? 'email' : undefined,
        },
      })
    },
    [client],
  )

  const sendEmailLink = useCallback(
    async (email: string) => {
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
        },
      })
      return error === null
    },
    [client],
  )

  const verifyEmailCode = useCallback(
    async ({ email, code }: { email: string; code: string }) => {
      const { error } = await client.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      })
      return error === null
    },
    [client],
  )

  const signOut = useCallback(() => {
    replaceStored({ key: PULLED_KEY, value: null })
    replaceStored({
      key: PENDING_KEY,
      value: Object.keys(
        readStored<Record<string, number>>({ key: STAMPS_KEY, fallback: {} }),
      ),
    })
    void client.auth.signOut()
  }, [client])

  return { user, signIn, sendEmailLink, verifyEmailCode, signOut }
}

async function fetchChanged<T>({
  client,
  table,
  columns,
  since,
}: {
  client: SupabaseClient
  table: string
  columns: string
  since: string
}): Promise<(T & SyncedRow)[] | null> {
  const rows: (T & SyncedRow)[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const page = await client
      .from(table)
      .select(`${columns}, synced_at`)
      .gt('synced_at', since)
      .order('synced_at')
      .range(from, from + PAGE_SIZE - 1)
    if (page.error !== null) return null
    const data = page.data as unknown as (T & SyncedRow)[]
    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
  }
}

async function pull(client: SupabaseClient) {
  const cursor = readStored<string | null>({ key: PULLED_KEY, fallback: null })
  const since = pullSince(cursor)
  const [rows, settingsRows] = await Promise.all([
    fetchChanged<SavedGameRow>({
      client,
      table: 'saved_games',
      columns: 'game, id, data, updated_at, deleted',
      since,
    }),
    fetchChanged<SettingsRow>({
      client,
      table: 'game_settings',
      columns: 'game, data, updated_at',
      since,
    }),
  ])
  if (rows === null || settingsRows === null) return false
  let stamps = readStored<Record<string, number>>({
    key: STAMPS_KEY,
    fallback: {},
  })
  const pending = new Set(
    readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
  )
  const changedKeys: string[] = []
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
      changedKeys.push(gamesKey)
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
      changedKeys.push(settingsKey)
    }
  }
  replaceStored({ key: STAMPS_KEY, value: stamps })
  replaceStored({ key: PENDING_KEY, value: [...pending] })
  replaceStored({
    key: PULLED_KEY,
    value: pulledUpTo({ cursor, rows: [...rows, ...settingsRows] }),
  })
  if (changedKeys.length > 0) {
    window.dispatchEvent(new CustomEvent(SYNCED_EVENT, { detail: changedKeys }))
  }
  return true
}

async function push(client: SupabaseClient) {
  const pending = readStored<string[]>({ key: PENDING_KEY, fallback: [] })
  if (pending.length === 0) return true
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
  if (saved.error !== null || settings.error !== null) return false
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
  return true
}

async function syncOnce(client: SupabaseClient) {
  const pushed = await push(client)
  const pulled = await pull(client)
  const pushedNew = pulled ? await push(client) : false
  return pushed && pulled && pushedNew
}
