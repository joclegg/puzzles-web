import { describe, expect, it } from 'vitest'

import { legacySettingsToKeep } from '@/shared/storage/legacySettings.functions'

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

describe('legacy Sudoku settings', () => {
  it('turns the old helpers on in both modes', () => {
    const kept = legacySettingsToKeep((key) =>
      key === 'sudoku.games' ? '[{"id":"a"}]' : null,
    )

    expect(
      kept.find((entry) => entry.key === 'sudoku.settings')?.value,
    ).toMatchObject({
      showHints: true,
      allowReveal: true,
      classic: { showHints: true, allowReveal: true, showTutorial: true },
      killer: { showHints: true, allowReveal: true, showTutorial: true },
    })
  })
})
