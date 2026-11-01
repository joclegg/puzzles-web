import { Button } from '@/shared/ui/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/shared/ui/Button/Button.constants'
import { THEME_OPTION } from '@/shared/ui/ThemeToggle/ThemeToggle.constants'
import { useTheme } from '@/shared/ui/ThemeToggle/ThemeToggle.hooks'

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const { next, label, icon: Icon } = THEME_OPTION[theme]

  return (
    <Button
      variant={BUTTON_VARIANT.OUTLINE}
      size={BUTTON_SIZE.ICON}
      aria-label={label}
      onClick={() => setTheme(next)}
    >
      <Icon />
    </Button>
  )
}
