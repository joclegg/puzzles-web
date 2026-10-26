import { useCallback, useState } from 'react'

import { readStored, writeStored } from '@/common/storage.functions'

export function useStoredState<T>({
  key,
  fallback,
}: {
  key: string
  fallback: T
}): [T, (update: (current: T) => T) => void] {
  const [value, setValue] = useState<T>(() => readStored({ key, fallback }))

  const update = useCallback(
    (change: (current: T) => T) => {
      setValue((current) => {
        const next = change(current)
        writeStored({ key, value: next })
        return next
      })
    },
    [key],
  )

  return [value, update]
}
