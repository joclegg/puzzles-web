import type { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export type MenuAccent = (typeof MENU_ACCENT)[keyof typeof MENU_ACCENT]
