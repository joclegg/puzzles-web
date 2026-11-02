import { describe, expect, it } from 'vitest'

import { THEME } from '@/shared/ui/ThemeToggle/ThemeToggle.constants'
import { isTheme } from '@/shared/ui/ThemeToggle/ThemeToggle.functions'

describe('isTheme', () => {
  it('accepts every theme', () => {
    for (const theme of Object.values(THEME)) {
      expect(isTheme(theme)).toBe(true)
    }
  })

  it('rejects anything else', () => {
    expect(isTheme('blue')).toBe(false)
    expect(isTheme(null)).toBe(false)
  })
})
