const IN_PROGRESS = 'inProgress'

export function trimSteps<T extends SavedSteps>({
  games,
  groupOf,
  strip,
}: {
  games: T[]
  groupOf: (game: T) => string
  strip: (game: T) => T
}): T[] {
  const latest = new Map<string, T>()
  for (const game of games) {
    if (game.status === IN_PROGRESS) {
      continue
    }
    const group = groupOf(game)
    const kept = latest.get(group)
    if (kept === undefined || endedAt(game) >= endedAt(kept)) {
      latest.set(group, game)
    }
  }
  const keep = new Set(latest.values())
  return games.map((game) =>
    game.status === IN_PROGRESS || keep.has(game) ? game : strip(game),
  )
}

interface SavedSteps {
  status: string
  startedAt: number
  finishedAt: number | null
}

function endedAt(game: SavedSteps) {
  return game.finishedAt ?? game.startedAt
}
