import { useCallback, useRef, useState } from 'react'

import { readStored, writeStored } from '@/common/storage.functions'

export function useStoredState<T>({
  key,
  fallback,
}: {
  key: string
  fallback: T
}): [T, (update: (current: T) => T) => void] {
  const [value, setValue] = useState<T>(() => readStored({ key, fallback }))
  const latestRef = useRef(value)

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
