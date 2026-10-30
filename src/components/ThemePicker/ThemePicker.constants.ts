import { THEME } from '@/components/ThemeToggle/ThemeToggle.constants'
import type { Theme } from '@/components/ThemeToggle/ThemeToggle.types'

export const THEME_LABEL: Record<Theme, string> = {
  [THEME.LIGHT]: 'Light',
  [THEME.DARK]: 'Dark',
}
