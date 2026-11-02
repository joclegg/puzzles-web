import { useCallback, useEffect, useRef, useState } from 'react'

import {
  readStoredWithRaw,
  writeStored,
} from '@/shared/storage/storage.functions'
import { SYNCED_EVENT } from '@/shared/sync/sync.constants'

export function useStoredState<T>({
  key,
  fallback,
}: {
  key: string
  fallback: T
}): [T, (update: (current: T) => T) => void] {
  const [initial] = useState(() => readStoredWithRaw({ key, fallback }))
  const [value, setValue] = useState<T>(initial.value)
  const latestRef = useRef(initial)
  const fallbackRef = useRef(fallback)

  useEffect(() => {
    function onSynced(event: Event) {
      if (!(event as CustomEvent<string[]>).detail.includes(key)) return
      const next = readStoredWithRaw({ key, fallback: fallbackRef.current })
      latestRef.current = next
      setValue(next.value)
    }
    window.addEventListener(SYNCED_EVENT, onSynced)
    return () => window.removeEventListener(SYNCED_EVENT, onSynced)
  }, [key])

  const update = useCallback(
    (change: (current: T) => T) => {
      const next = change(latestRef.current.value)
      const raw = writeStored({ key, value: next, previous: latestRef.current })
      latestRef.current = { value: next, raw }
      setValue(next)
    },
    [key],
  )

  return [value, update]
}
