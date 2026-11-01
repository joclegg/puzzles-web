import { THEME } from '@/shared/ui/ThemeToggle/ThemeToggle.constants'
import type { Theme } from '@/shared/ui/ThemeToggle/ThemeToggle.types'

const THEMES: readonly string[] = Object.values(THEME)

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEMES.includes(value)
}
