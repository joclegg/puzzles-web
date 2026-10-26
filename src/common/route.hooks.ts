import { useSyncExternalStore } from 'react'

import { parseHash, routeHash } from '@/common/route.functions'

export function navigate(segments: readonly (string | number)[]): void {
  window.location.hash = routeHash(segments)
}

export function replaceRoute(segments: readonly (string | number)[]): void {
  window.location.replace(routeHash(segments))
}

export function useRoute(): string[] {
  const hash = useSyncExternalStore(subscribe, readHash)
  return parseHash(hash)
}

function readHash(): string {
  return window.location.hash
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
