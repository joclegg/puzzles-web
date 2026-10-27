export function readStored<T>({ key, fallback }: { key: string; fallback: T }) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null
      ? fallback
      : withDefaults({ stored: JSON.parse(stored) as T, fallback })
  } catch {
    return fallback
  }
}

export function withDefaults<T>({
  stored,
  fallback,
}: {
  stored: T
  fallback: T
}) {
  return isPlainObject(stored) && isPlainObject(fallback)
    ? { ...fallback, ...stored }
    : stored
}

export function writeStored<T>({ key, value }: { key: string; value: T }) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

function isPlainObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
