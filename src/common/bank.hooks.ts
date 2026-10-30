import { useEffect, useState } from 'react'

import { DATA_URL } from '@/common/bank.constants'

export async function fetchBank(path: string): Promise<string> {
  const response = await fetch(`${DATA_URL}/${path}`, { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`Could not load ${path}`)
  }
  return response.text()
}

export function useBank(path: string): string | null {
  const [loaded, setLoaded] = useState<{ path: string; text: string } | null>(
    null,
  )

  useEffect(() => {
    let active = true
    void fetchBank(path).then((text) => {
      if (active) setLoaded({ path, text })
    })
    return () => {
      active = false
    }
  }, [path])

  return loaded?.path === path ? loaded.text : null
}
