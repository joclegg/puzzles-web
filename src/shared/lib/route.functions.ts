export function parseHash(hash: string): string[] {
  return hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter((segment) => segment.length > 0)
}

export function routeHash(segments: readonly (string | number)[]): string {
  const path = segments.filter((segment) => segment !== '').join('/')
  return `#/${path}`
}
