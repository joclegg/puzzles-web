import { useCallback, useEffect, useRef, useState } from 'react'

import { readStored, writeStored } from '@/shared/storage/storage.functions'
import { SYNCED_EVENT } from '@/shared/sync/sync.constants'

export function useStoredState<T>({
  key,
  fallback,
}: {
  key: string
  fallback: T
}): [T, (update: (current: T) => T) => void] {
  const [value, setValue] = useState<T>(() => readStored({ key, fallback }))
  const latestRef = useRef(value)
  const fallbackRef = useRef(fallback)

  useEffect(() => {
    function onSynced(event: Event) {
      if (!(event as CustomEvent<string[]>).detail.includes(key)) return
      const next = readStored({ key, fallback: fallbackRef.current })
      latestRef.current = next
      setValue(next)
    }
    window.addEventListener(SYNCED_EVENT, onSynced)
    return () => window.removeEventListener(SYNCED_EVENT, onSynced)
  }, [key])

  const update = useCallback(
    (change: (current: T) => T) => {
      const next = change(latestRef.current)
      latestRef.current = next
      writeStored({ key, value: next })
      setValue(next)
    },
    [key],
  )

  return [value, update]
}
