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
  ios: 'https://apps.apple.com/us/app/puzzles-by-jo-clegg/id6832094390',
  android: 'https://play.google.com/store/apps/details?id=com.joclegg.puzzles',
}
