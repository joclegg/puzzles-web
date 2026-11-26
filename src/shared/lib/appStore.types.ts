import type {
  APP_PROMPT_CHOICE,
  MOBILE_PLATFORM,
} from '@/shared/lib/appStore.constants'

export type AppPromptChoice =
  (typeof APP_PROMPT_CHOICE)[keyof typeof APP_PROMPT_CHOICE]

export type MobilePlatform =
  (typeof MOBILE_PLATFORM)[keyof typeof MOBILE_PLATFORM]
