import { MOBILE_PLATFORM, STORE_URL } from '@/shared/lib/appStore.constants'
import type { MobilePlatform } from '@/shared/lib/appStore.types'

export function mobilePlatformOf({
  userAgent,
  maxTouchPoints,
}: {
  userAgent: string
  maxTouchPoints: number
}): MobilePlatform {
  if (/iPhone|iPad|iPod/.test(userAgent)) return MOBILE_PLATFORM.IOS
  if (/Macintosh/.test(userAgent) && maxTouchPoints > 1) {
    return MOBILE_PLATFORM.IOS
  }
  if (/Android/.test(userAgent)) return MOBILE_PLATFORM.ANDROID
  return MOBILE_PLATFORM.OTHER
}

export function storeUrlFor(platform: MobilePlatform): string | null {
  if (platform === MOBILE_PLATFORM.OTHER) return null
  return STORE_URL[platform]
}
