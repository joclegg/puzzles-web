import {
  GAMES_KEYS,
  LEGACY_SETTINGS,
} from '@/shared/storage/legacySettings.constants'

export function legacySettingsToKeep(
  read: (key: string) => string | null,
): { key: string; value: object }[] {
  const existing = GAMES_KEYS.some((key) => {
    try {
      const games: unknown = JSON.parse(read(key) ?? '[]')
      return Array.isArray(games) && games.length > 0
    } catch {
      return false
    }
  })
  if (!existing) {
    return []
  }
  return Object.entries(LEGACY_SETTINGS)
    .filter(([key]) => read(key) === null)
    .map(([key, value]) => ({ key, value }))
}
