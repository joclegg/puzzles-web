export const APP_PROMPT_KEY = 'appPrompt.choice'

export const MOBILE_PLATFORM = {
  IOS: 'ios',
  ANDROID: 'android',
  OTHER: 'other',
} as const

export const APP_PROMPT_CHOICE = {
  APP: 'app',
  WEB: 'web',
} as const

export const STORE_URL: Record<'ios' | 'android', string | null> = {
  ios: 'https://apps.apple.com/app/id0000000000',
  android: null,
}
