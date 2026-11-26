import { describe, expect, it } from 'vitest'

import { MOBILE_PLATFORM, STORE_URL } from '@/shared/lib/appStore.constants'
import { mobilePlatformOf, storeUrlFor } from '@/shared/lib/appStore.functions'

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'
const PIXEL =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'

describe('mobilePlatformOf', () => {
  it('finds an iPhone', () => {
    expect(mobilePlatformOf({ userAgent: IPHONE, maxTouchPoints: 5 })).toBe(
      MOBILE_PLATFORM.IOS,
    )
  })

  it('finds an iPad that asks for the desktop site', () => {
    expect(mobilePlatformOf({ userAgent: MAC, maxTouchPoints: 5 })).toBe(
      MOBILE_PLATFORM.IOS,
    )
  })

  it('leaves a Mac alone', () => {
    expect(mobilePlatformOf({ userAgent: MAC, maxTouchPoints: 0 })).toBe(
      MOBILE_PLATFORM.OTHER,
    )
  })

  it('finds an Android phone', () => {
    expect(mobilePlatformOf({ userAgent: PIXEL, maxTouchPoints: 5 })).toBe(
      MOBILE_PLATFORM.ANDROID,
    )
  })
})

describe('storeUrlFor', () => {
  it('gives the store for the platform', () => {
    expect(storeUrlFor(MOBILE_PLATFORM.IOS)).toBe(STORE_URL.ios)
    expect(storeUrlFor(MOBILE_PLATFORM.ANDROID)).toBe(STORE_URL.android)
  })

  it('gives nothing on a desktop', () => {
    expect(storeUrlFor(MOBILE_PLATFORM.OTHER)).toBeNull()
  })
})
