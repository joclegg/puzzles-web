import type { SupabaseClient, User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'

import { readStored, replaceStored } from '@/shared/storage/storage.functions'
import {
  AUTH_STORAGE_KEY,
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
  SYNCED_EVENT,
} from '@/shared/sync/sync.constants'
import {
  deleteAccountThenSignOut,
  keysetAfter,
  mergePulled,
  pulledUpTo,
  pullSince,
  pushRows,
  shouldLoadClient,
  stillPending,
  syncableOnly,
} from '@/shared/sync/sync.functions'
import type {
  SavedGameRow,
  SettingsRow,
  SignInProvider,
  SyncedEntry,
  SyncedRow,
} from '@/shared/sync/sync.types'

export function useSync() {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const loadingRef = useRef<Promise<SupabaseClient> | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const runningRef = useRef<Promise<void>>(Promise.resolve())
  const userId = user?.id ?? null

  const loadClient = useCallback(() => {
    loadingRef.current ??= import('@supabase/supabase-js').then(
      ({ createClient }) => {
        const created = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { flowType: 'pkce', detectSessionInUrl: true },
        })
        setClient(created)
        return created
      },
    )
    return loadingRef.current
  }, [])

  useEffect(() => {
    if (
      shouldLoadClient({
        storageKeys: storedKeys(),
        search: window.location.search,
        hash: window.location.hash,
        authKey: AUTH_STORAGE_KEY,
      })
    ) {
      void loadClient()
    }
  }, [loadClient])

  useEffect(() => {
    if (client === null) return
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
    if (client === null || userId === null) return
    const loaded = client
    let active = true
    function schedule(delayMs: number) {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(run, delayMs)
    }
    function run() {
      runningRef.current = runningRef.current.then(async () => {
        if (!active) return
        const synced = await syncOnce(loaded)
        if (!synced && active) schedule(RETRY_MS)
      })
    }
    function onStored() {
      schedule(PUSH_DELAY_MS)
    }
    run()
    window.addEventListener(STORED_EVENT, onStored)
    window.addEventListener('online', run)
    document.addEventListener('visibilitychange', run)
    return () => {
      active = false
      window.clearTimeout(timerRef.current)
      window.removeEventListener(STORED_EVENT, onStored)
      window.removeEventListener('online', run)
      document.removeEventListener('visibilitychange', run)
    }
  }, [client, userId])

  const signIn = useCallback(
    async (provider: SignInProvider) => {
      const loaded = await loadClient()
      await loaded.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          scopes: provider === SIGN_IN_PROVIDER.MICROSOFT ? 'email' : undefined,
        },
      })
    },
    [loadClient],
  )

  const sendEmailLink = useCallback(
    async (email: string) => {
      const loaded = await loadClient()
      const { error } = await loaded.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
        },
      })
      return error === null
    },
    [loadClient],
  )

  const verifyEmailCode = useCallback(
    async ({ email, code }: { email: string; code: string }) => {
      const loaded = await loadClient()
      const { error } = await loaded.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      })
      return error === null
    },
    [loadClient],
  )

  const signOut = useCallback(() => {
    replaceStored({ key: PULLED_KEY, value: null })
    replaceStored({
      key: PENDING_KEY,
      value: Object.keys(
        readStored<Record<string, number>>({ key: STAMPS_KEY, fallback: {} }),
      ),
    })
    void loadClient().then((loaded) => loaded.auth.signOut())
  }, [loadClient])

  const deleteAccount = useCallback(
    () =>
      deleteAccountThenSignOut({
        rpc: () => loadClient().then((loaded) => loaded.rpc('delete_account')),
        signOut,
      }),
    [loadClient, signOut],
  )

  return {
    user,
    signIn,
    sendEmailLink,
    verifyEmailCode,
    signOut,
    deleteAccount,
  }
}

function dropUnsyncableKeys() {
  const kept = syncableOnly({
    pending: readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
    stamps: readStored<Record<string, number>>({
      key: STAMPS_KEY,
      fallback: {},
    }),
  })
  replaceStored({ key: PENDING_KEY, value: kept.pending })
  replaceStored({ key: STAMPS_KEY, value: kept.stamps })
}

async function fetchChanged<T>({
  client,
  table,
  columns,
  keys,
  since,
}: {
  client: SupabaseClient
  table: string
  columns: string
  keys: string[]
  since: string
}): Promise<(T & SyncedRow)[] | null> {
  const rows: (T & SyncedRow)[] = []
  let last: Record<string, string> | null = null
  for (;;) {
    let query = client
      .from(table)
      .select(`${columns}, synced_at`)
      .gt('synced_at', since)
    if (last !== null) {
      query = query.or(keysetAfter({ row: last, keys: ['synced_at', ...keys] }))
    }
    for (const key of ['synced_at', ...keys]) {
      query = query.order(key)
    }
    const page = await query.limit(PAGE_SIZE)
    if (page.error !== null) return null
    const data = page.data as unknown as (T & SyncedRow)[]
    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
    last = data[data.length - 1] as unknown as Record<string, string>
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
      keys: ['game', 'id'],
      since,
    }),
    fetchChanged<SettingsRow>({
      client,
      table: 'game_settings',
      columns: 'game, data, updated_at',
      keys: ['game'],
      since,
    }),
  ])
  if (rows === null || settingsRows === null) return false
  const merged = mergePulled({
    rows,
    settingsRows,
    stamps: readStored<Record<string, number>>({
      key: STAMPS_KEY,
      fallback: {},
    }),
    pending: readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
    readGames,
    readSettings: (key) => readStored<unknown>({ key, fallback: null }),
    now: Date.now,
  })
  for (const write of merged.writes) {
    replaceStored(write)
  }
  const changedKeys = merged.changedKeys
  replaceStored({ key: STAMPS_KEY, value: merged.stamps })
  replaceStored({ key: PENDING_KEY, value: merged.pending })
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
  const { savedRows, settingsRows } = pushRows({
    pending,
    stamps,
    readGames,
    readSettings: (key) => readStored<unknown>({ key, fallback: {} }),
    now: Date.now,
  })
  const [saved, settings] = await Promise.all([
    savedRows.length > 0
      ? client.from('saved_games').upsert(savedRows)
      : Promise.resolve({ error: null }),
    settingsRows.length > 0
      ? client.from('game_settings').upsert(settingsRows)
      : Promise.resolve({ error: null }),
  ])
  replaceStored({
    key: PENDING_KEY,
    value: stillPending({
      pushed: pending,
      current: readStored<string[]>({ key: PENDING_KEY, fallback: [] }),
      stamps,
      latest: readStored<Record<string, number>>({
        key: STAMPS_KEY,
        fallback: {},
      }),
      savedOk: saved.error === null,
      settingsOk: settings.error === null,
    }),
  })
  return saved.error === null && settings.error === null
}

function readGames(key: string) {
  return readStored<SyncedEntry[]>({ key, fallback: [] })
}

function storedKeys() {
  try {
    return Object.keys(localStorage)
  } catch {
    return []
  }
}

async function syncOnce(client: SupabaseClient) {
  dropUnsyncableKeys()
  const pushed = await push(client)
  const pulled = await pull(client)
  const pushedNew = pulled ? await push(client) : false
  return pushed && pulled && pushedNew
}
