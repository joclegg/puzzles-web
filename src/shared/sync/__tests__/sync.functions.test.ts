import { describe, expect, it } from 'vitest'

import {
  changedEntryIds,
  isProgressOnly,
  isSyncableKey,
  cleanEmailCode,
  deleteAccountThenSignOut,
  entryStampKey,
  isEmailAddress,
  mergeGames,
  mergePulled,
  mergeSettings,
  parseStampKey,
  pulledUpTo,
  pullSince,
  pushRows,
  recordChanges,
  settingsStampKey,
  stillPending,
  syncableOnly,
  syncedKey,
} from '@/shared/sync/sync.functions'

describe('changedEntryIds', () => {
  it('lists added, changed and removed entries', () => {
    expect(
      changedEntryIds({
        before: [
          entry({ id: 'a', v: '1' }),
          entry({ id: 'b', v: '1' }),
          entry({ id: 'c', v: '1' }),
        ],
        after: [
          entry({ id: 'a', v: '1' }),
          entry({ id: 'b', v: '2' }),
          entry({ id: 'd', v: '1' }),
        ],
      }),
    ).toEqual(['b', 'd', 'c'])
  })
})

describe('cleanEmailCode', () => {
  it('keeps only digits', () => {
    expect(cleanEmailCode(' 1234 5678 ')).toBe('12345678')
  })

  it('stops at the code length', () => {
    expect(cleanEmailCode('1234567890')).toBe('12345678')
  })
})

describe('isEmailAddress', () => {
  it('accepts an address with a domain', () => {
    expect(isEmailAddress(' player@example.com ')).toBe(true)
  })

  it('rejects text without an at sign or a dot', () => {
    expect(isEmailAddress('player')).toBe(false)
    expect(isEmailAddress('player@example')).toBe(false)
  })
})

describe('mergeGames', () => {
  it('takes newer remote rows, keeps newer local ones and lists unstamped', () => {
    const merged = mergeGames({
      game: 'sudoku',
      games: [
        entry({ id: 'local-newer', v: 'local' }),
        entry({ id: 'remote-newer', v: 'local' }),
        entry({ id: 'deleted', v: 'local' }),
        entry({ id: 'never-synced', v: 'local' }),
      ],
      rows: [
        row({ id: 'local-newer', at: 100 }),
        row({ id: 'remote-newer', at: 300 }),
        row({ id: 'deleted', at: 300, deleted: true }),
        row({ id: 'remote-only', at: 300 }),
        { ...row({ id: 'other', at: 300 }), game: 'kakuro' },
      ],
      stamps: {
        [entryStampKey({ game: 'sudoku', id: 'local-newer' })]: 200,
        [entryStampKey({ game: 'sudoku', id: 'remote-newer' })]: 200,
        [entryStampKey({ game: 'sudoku', id: 'deleted' })]: 200,
      },
    })

    expect([merged.games, merged.changed, merged.unstamped]).toEqual([
      [
        entry({ id: 'local-newer', v: 'local' }),
        entry({ id: 'remote-newer', v: 'remote' }),
        entry({ id: 'never-synced', v: 'local' }),
        entry({ id: 'remote-only', v: 'remote' }),
      ],
      true,
      ['never-synced'],
    ])
  })
})

describe('mergeSettings', () => {
  it('takes newer remote settings', () => {
    const merged = mergeSettings({
      game: 'sudoku',
      settings: { a: 1 },
      row: { game: 'sudoku', data: { a: 2 }, updated_at: iso(300) },
      stamps: { [settingsStampKey('sudoku')]: 200 },
    })

    expect([merged.settings, merged.changed]).toEqual([{ a: 2 }, true])
  })

  it('marks local settings that were never synced', () => {
    const merged = mergeSettings({
      game: 'sudoku',
      settings: { a: 1 },
      row: undefined,
      stamps: {},
    })

    expect([merged.settings, merged.changed, merged.unstamped]).toEqual([
      { a: 1 },
      false,
      true,
    ])
  })
})

describe('parseStampKey', () => {
  it('reads game, kind and id', () => {
    expect([
      parseStampKey(entryStampKey({ game: 'sudoku', id: 'x' })),
      parseStampKey(settingsStampKey('kakuro')),
    ]).toEqual([
      { game: 'sudoku', kind: 'games', id: 'x' },
      { game: 'kakuro', kind: 'settings', id: null },
    ])
  })
})

describe('recordChanges', () => {
  it('stamps each key later than before and queues it once', () => {
    expect(
      recordChanges({
        stamps: { a: 500 },
        pending: ['a'],
        keys: ['a', 'b'],
        now: 100,
      }),
    ).toEqual({ stamps: { a: 501, b: 100 }, pending: ['a', 'b'] })
  })
})

describe('syncedKey', () => {
  it('syncs only game saves and settings', () => {
    expect([
      syncedKey('sudoku.games'),
      syncedKey('fiveLetters.settings'),
      syncedKey('sudoku.homeMode'),
      syncedKey('theme'),
    ]).toEqual([
      { game: 'sudoku', kind: 'games' },
      { game: 'fiveLetters', kind: 'settings' },
      null,
      null,
    ])
  })
})

function entry({ id, v }: { id: string; v: string }) {
  return { id, v }
}

function iso(ms: number) {
  return new Date(ms).toISOString()
}

function row({
  id,
  at,
  deleted = false,
}: {
  id: string
  at: number
  deleted?: boolean
}) {
  return {
    game: 'sudoku',
    id,
    data: entry({ id, v: 'remote' }),
    updated_at: iso(at),
    deleted,
  }
}

describe('pulledUpTo', () => {
  it('keeps the latest synced time seen', () => {
    expect(
      pulledUpTo({
        cursor: '2026-10-29T10:00:00.000Z',
        rows: [
          { synced_at: '2026-10-29T12:00:00.000Z' },
          { synced_at: '2026-10-29T11:00:00.000Z' },
        ],
      }),
    ).toBe('2026-10-29T12:00:00.000Z')
    expect(pulledUpTo({ cursor: null, rows: [] })).toBeNull()
  })
})

describe('pullSince', () => {
  it('pulls everything the first time and overlaps a minute after that', () => {
    expect(pullSince(null)).toBe('1970-01-01T00:00:00.000Z')
    expect(pullSince('2026-10-29T12:00:00.000Z')).toBe(
      '2026-10-29T11:59:00.000Z',
    )
  })
})

describe('isProgressOnly', () => {
  const playing = { id: 'a', status: 'inProgress' }

  it.each([
    ['a save with the same status', [playing], [playing], true],
    ['a finished game', [playing], [{ id: 'a', status: 'solved' }], false],
    ['a new game', [], [playing], false],
    ['a removed game', [playing], [], false],
  ])('given %s then returns %s', (_name, before, after, expected) => {
    expect(isProgressOnly({ before, after })).toBe(expected)
  })
})

describe('isSyncableKey', () => {
  it.each([
    ['kakuro.games/1', false],
    ['kakuro.games/3f2b8c1e-6a4d-4e7b-9c10-2d5f8a7b1c3e', true],
    ['kakuro.settings', true],
  ])('given %s then returns %s', (key, expected) => {
    expect(isSyncableKey(key)).toBe(expected)
  })
})

describe('deleteAccountThenSignOut', () => {
  it('signs out after the account is deleted', async () => {
    const calls: string[] = []
    const deleted = await deleteAccountThenSignOut({
      rpc: async () => ({ error: null }),
      signOut: () => calls.push('signOut'),
    })
    expect(deleted).toBe(true)
    expect(calls).toEqual(['signOut'])
  })

  it('stays signed in when the server returns an error', async () => {
    const calls: string[] = []
    const deleted = await deleteAccountThenSignOut({
      rpc: async () => ({ error: { message: 'nope' } }),
      signOut: () => calls.push('signOut'),
    })
    expect(deleted).toBe(false)
    expect(calls).toEqual([])
  })

  it('stays signed in when the request fails', async () => {
    const calls: string[] = []
    const deleted = await deleteAccountThenSignOut({
      rpc: async () => {
        throw new Error('offline')
      },
      signOut: () => calls.push('signOut'),
    })
    expect(deleted).toBe(false)
    expect(calls).toEqual([])
  })
})

describe('mergePulled', () => {
  it('writes pulled entries and stamps local entries the server lacks', () => {
    const merged = mergePulled({
      rows: [
        {
          game: 'kakuro',
          id: 'a',
          data: { id: 'a' },
          updated_at: '2026-01-01T00:00:00.000Z',
          deleted: false,
        },
      ],
      settingsRows: [],
      stamps: {},
      pending: [],
      readGames: (key) => (key === 'kakuro.games' ? [{ id: 'b' }] : []),
      readSettings: () => null,
      now: () => 5,
    })
    expect(merged.changedKeys).toEqual(['kakuro.games'])
    expect(merged.writes).toEqual([
      { key: 'kakuro.games', value: [{ id: 'b' }, { id: 'a' }] },
    ])
    expect(merged.pending).toEqual(['kakuro.games/b'])
    expect(merged.stamps).toEqual({
      'kakuro.games/a': Date.parse('2026-01-01T00:00:00.000Z'),
      'kakuro.games/b': 5,
    })
  })
})

describe('pushRows', () => {
  it('builds a row per pending key, marking missing entries deleted', () => {
    const rows = pushRows({
      pending: ['kakuro.games/a', 'kakuro.games/gone', 'kakuro.settings'],
      stamps: { 'kakuro.games/a': 0 },
      readGames: () => [{ id: 'a' }],
      readSettings: () => ({ dark: true }),
      now: () => 1000,
    })
    expect(rows.savedRows).toEqual([
      {
        game: 'kakuro',
        id: 'a',
        data: { id: 'a' },
        updated_at: '1970-01-01T00:00:00.000Z',
        deleted: false,
      },
      {
        game: 'kakuro',
        id: 'gone',
        data: {},
        updated_at: '1970-01-01T00:00:01.000Z',
        deleted: true,
      },
    ])
    expect(rows.settingsRows).toEqual([
      {
        game: 'kakuro',
        data: { dark: true },
        updated_at: '1970-01-01T00:00:01.000Z',
      },
    ])
  })
})

describe('stillPending', () => {
  it('keeps keys that failed or changed while uploading', () => {
    expect(
      stillPending({
        pushed: ['kakuro.games/a', 'kakuro.games/b', 'kakuro.settings'],
        current: [
          'kakuro.games/a',
          'kakuro.games/b',
          'kakuro.settings',
          'kakuro.games/c',
        ],
        stamps: { 'kakuro.games/a': 1, 'kakuro.games/b': 1 },
        latest: { 'kakuro.games/a': 1, 'kakuro.games/b': 2 },
        savedOk: true,
        settingsOk: false,
      }),
    ).toEqual(['kakuro.games/b', 'kakuro.settings', 'kakuro.games/c'])
  })
})

describe('syncableOnly', () => {
  it('drops entry keys whose id is not a uuid', () => {
    const uuid = '0f8fad5b-d9cb-469f-a165-70867728950e'
    expect(
      syncableOnly({
        pending: [
          `kakuro.games/${uuid}`,
          'kakuro.games/old',
          'kakuro.settings',
        ],
        stamps: { [`kakuro.games/${uuid}`]: 1, 'kakuro.games/old': 2 },
      }),
    ).toEqual({
      pending: [`kakuro.games/${uuid}`, 'kakuro.settings'],
      stamps: { [`kakuro.games/${uuid}`]: 1 },
    })
  })
})
