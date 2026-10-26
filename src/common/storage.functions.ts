export function readStored<T>({ key, fallback }: { key: string; fallback: T }) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? fallback : (JSON.parse(stored) as T)
  } catch {
    return fallback
  }
}

export function writeStored<T>({ key, value }: { key: string; value: T }) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}
