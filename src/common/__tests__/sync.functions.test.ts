import { describe, expect, it } from 'vitest'

import {
  changedEntryIds,
  entryStampKey,
  mergeGames,
  mergeSettings,
  parseStampKey,
  recordChanges,
  settingsStampKey,
  syncedKey,
} from '@/common/sync.functions'

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
