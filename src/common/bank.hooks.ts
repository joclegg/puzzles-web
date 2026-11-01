import { useEffect, useState } from 'react'

import { DATA_URL } from '@/common/bank.constants'
import { bankLines } from '@/common/bank.functions'

const LOADED_BANKS = new Map<string, string>()

const PENDING_BANKS = new Map<string, Promise<string>>()

export function fetchBank(path: string): Promise<string> {
  const loaded = LOADED_BANKS.get(path)
  if (loaded !== undefined) {
    return Promise.resolve(loaded)
  }
  const pending = PENDING_BANKS.get(path)
  if (pending) {
    return pending
  }
  const request = downloadBank(path).then(
    (text) => {
      LOADED_BANKS.set(path, text)
      PENDING_BANKS.delete(path)
      return text
    },
    (error: unknown) => {
      PENDING_BANKS.delete(path)
      throw error
    },
  )
  PENDING_BANKS.set(path, request)
  return request
}

export async function fetchBankLines(path: string): Promise<string[]> {
  return bankLines(await fetchBank(path))
}

export function useBank(path: string): string | null {
  const [loaded, setLoaded] = useState<{ path: string; text: string } | null>(
    null,
  )

  useEffect(() => {
    if (LOADED_BANKS.has(path)) {
      return
    }
    let active = true
    void fetchBank(path).then((text) => {
      if (active) setLoaded({ path, text })
    })
    return () => {
      active = false
    }
  }, [path])

  return loaded?.path === path ? loaded.text : (LOADED_BANKS.get(path) ?? null)
}

async function downloadBank(path: string): Promise<string> {
  const response = await fetch(`${DATA_URL}/${path}`, { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`Could not load ${path}`)
  }
  return response.text()
}
