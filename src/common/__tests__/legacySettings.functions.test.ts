import { describe, expect, it } from 'vitest'

import { legacySettingsToKeep } from '@/common/legacySettings.functions'

describe('legacySettingsToKeep', () => {
  it('keeps nothing for a new player', () => {
    expect(legacySettingsToKeep(() => null)).toEqual([])
  })

  it('keeps the old helpers on for a player with saves but no settings', () => {
    const stored: Record<string, string> = {
      'twoTone.games': '[{"id":"a"}]',
      'kakuro.settings': '{}',
    }

    const kept = legacySettingsToKeep((key) => stored[key] ?? null)

    expect(kept.map((entry) => entry.key)).not.toContain('kakuro.settings')
    expect(
      kept.find((entry) => entry.key === 'twoTone.settings')?.value,
    ).toMatchObject({ showHints: true, markBrokenRules: true })
  })
})
