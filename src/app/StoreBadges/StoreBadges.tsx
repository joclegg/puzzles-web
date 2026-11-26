import { STORE_URL } from '@/shared/lib/appStore.constants'

export function StoreBadges() {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-3 pt-2 md:col-span-2">
      {STORE_URL.ios && (
        <a
          href={STORE_URL.ios}
          aria-label="Download on the App Store"
          className="flex h-11 items-center gap-2 rounded-lg border border-neutral-500 bg-black px-3 text-white"
        >
          <svg
            viewBox="0 0 384 512"
            aria-hidden="true"
            className="size-6 fill-current"
          >
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-[0.6rem]">Download on the</span>
            <span className="text-lg font-semibold">App Store</span>
          </span>
        </a>
      )}
      {STORE_URL.android && (
        <a
          href={STORE_URL.android}
          aria-label="Get it on Google Play"
          className="flex h-11 items-center gap-2 rounded-lg border border-neutral-500 bg-black px-3 text-white"
        >
          <svg viewBox="0 0 512 512" aria-hidden="true" className="size-6">
            <path
              fill="#00d7fe"
              d="M48 32 280 256 48 480c-9-5-16-15-16-28V60c0-13 7-23 16-28z"
            />
            <path
              fill="#ffce00"
              d="m360 176 72 41c25 14 25 50 0 64l-72 41-80-66z"
            />
            <path fill="#ff3a44" d="M280 256 48 480c6 4 15 4 24-1l288-157z" />
            <path
              fill="#00f076"
              d="M48 32 280 256l80-80L72 33c-9-5-18-5-24-1z"
            />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-[0.6rem] uppercase">Get it on</span>
            <span className="text-lg font-semibold">Google Play</span>
          </span>
        </a>
      )}
    </footer>
  )
}
