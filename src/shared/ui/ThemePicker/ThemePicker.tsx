import { THEME } from '@/shared/ui/ThemeToggle/ThemeToggle.constants'
import { useTheme } from '@/shared/ui/ThemeToggle/ThemeToggle.hooks'
import { OptionGroup } from '@/shared/ui/OptionGroup/OptionGroup'
import { THEME_LABEL } from '@/shared/ui/ThemePicker/ThemePicker.constants'

export function ThemePicker() {
  const [theme, setTheme] = useTheme()

  return (
    <section
      aria-label="Appearance"
      className="pt-1 [--game:var(--foreground)]"
    >
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
