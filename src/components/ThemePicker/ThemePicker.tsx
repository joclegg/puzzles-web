import { THEME } from '@/components/ThemeToggle/ThemeToggle.constants'
import { useTheme } from '@/components/ThemeToggle/ThemeToggle.hooks'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { THEME_LABEL } from '@/components/ThemePicker/ThemePicker.constants'

export function ThemePicker() {
  const [theme, setTheme] = useTheme()

  return (
    <section aria-label="Appearance" className="pt-1 [--game:var(--foreground)]">
      <h2 className="font-semibold">Appearance</h2>
      <OptionGroup
        label="Theme"
        options={Object.values(THEME)}
        value={theme}
        labels={THEME_LABEL}
        onChange={setTheme}
      />
    </section>
  )
}
