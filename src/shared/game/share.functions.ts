import { MEDAL } from '@/shared/game/dailyMedal.constants'
import { dailyDays } from '@/shared/game/dailyMedal.functions'
import type { DailyDay, DailyResult } from '@/shared/game/dailyMedal.types'
import type { PuzzleOptions } from '@/shared/game/game.types'
import { PUZZLE_STATUS } from '@/shared/game/puzzleSaves.constants'
import {
  dailyDate,
  dailyPuzzleResults,
} from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import {
  CHART_WIDTH,
  MEDAL_EMOJI,
  MEDAL_SQUARE,
  SHARE_LINK,
} from '@/shared/game/share.constants'
import { addDays } from '@/shared/lib/date.functions'
import { formatDayMonth, formatDuration } from '@/shared/lib/format.functions'

export function dailiesShareText({
  name,
  date,
  body,
  days,
}: {
  name: string
  date: string
  body: string
  days: Map<string, DailyDay>
}): string {
  const emoji = MEDAL_EMOJI[days.get(date)?.medal ?? MEDAL.NONE]
  const header = `${name} · ${formatDayMonth(date)}${emoji ? ` ${emoji}` : ''}`
  return `${header}\n${body}\n\nLast 7 days ${lastSevenDays({ days, date })}\n${SHARE_LINK}`
}

export function dailyLine({
  label,
  ms,
  best = false,
  moves,
}: {
  label: string
  ms: number | null
  best?: boolean
  moves?: number
}): string {
  if (ms === null) {
    return `${label} ⬛`
  }
  const count = moves === undefined ? '' : ` · ${moves} moves`
  return `${label} ${formatDuration(ms)}${count}${best ? ' ⭐' : ''}`
}

export function dailyStreaks({
  results,
  today,
}: {
  results: DailyResult[]
  today: string
}): { current: number; longest: number } {
  const dates = new Set(results.map((result) => result.date))
  let day = dates.has(today) ? today : addDays({ date: today, days: -1 })
  let current = 0
  while (dates.has(day)) {
    current++
    day = addDays({ date: day, days: -1 })
  }
  let longest = 0
  for (const date of dates) {
    if (dates.has(addDays({ date, days: -1 }))) {
      continue
    }
    let run = 0
    let next = date
    while (dates.has(next)) {
      run++
      next = addDays({ date: next, days: 1 })
    }
    longest = Math.max(longest, run)
  }
  return { current, longest }
}

export function guessChart(counts: readonly number[]): string {
  const most = Math.max(0, ...counts)
  return counts
    .map((count, index) => {
      const width =
        count === 0 ? 0 : Math.max(1, Math.round((count * CHART_WIDTH) / most))
      return `${index + 1} ${'🟩'.repeat(width)} ${count}`
    })
    .join('\n')
}

export function lastSevenDays({
  days,
  date,
}: {
  days: Map<string, DailyDay>
  date: string
}): string {
  return Array.from(
    { length: 7 },
    (_, index) =>
      MEDAL_SQUARE[
        days.get(addDays({ date, days: index - 6 }))?.medal ?? MEDAL.NONE
      ],
  ).join('')
}

export function puzzleDailiesShare<T extends number | string>({
  name,
  games,
  options,
  date,
  moves = false,
  dayOf,
}: {
  name: string
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
  date: string
  moves?: boolean
  dayOf: (ms: number) => string
}): string {
  const solved = games.filter((game) => game.status === PUZZLE_STATUS.SOLVED)
  const body = options.values
    .map((value) => {
      const times = solved
        .filter((game) => options.of(game) === value)
        .map((game) => game.elapsedMs)
      const daily = solved.find(
        (game) => game.puzzleId === options.dailyId({ date, value }),
      )
      return dailyLine({
        label: options.label(value),
        ms: daily?.elapsedMs ?? null,
        best: daily !== undefined && daily.elapsedMs <= Math.min(...times),
        moves: moves && daily ? (daily.moveCount ?? 0) : undefined,
      })
    })
    .join('\n')
  return dailiesShareText({
    name,
    date,
    body,
    days: dailyDays({
      results: dailyPuzzleResults(games),
      total: options.values.length,
      dayOf,
    }),
  })
}

export function puzzleRecordsShare<T extends number | string>({
  name,
  games,
  options,
  today,
  moves = false,
}: {
  name: string
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
  today: string
  moves?: boolean
}): string {
  const solved = games.filter((game) => game.status === PUZZLE_STATUS.SOLVED)
  const lines = options.values.flatMap((value) => {
    const mine = solved.filter((game) => options.of(game) === value)
    if (mine.length === 0) {
      return []
    }
    const best = formatDuration(Math.min(...mine.map((game) => game.elapsedMs)))
    const fewest = Math.min(...mine.map((game) => game.moveCount ?? 0))
    return [
      `${options.label(value)} ${best}${moves ? ` · ${fewest} moves` : ''}`,
    ]
  })
  const { current, longest } = dailyStreaks({
    results: dailyPuzzleResults(games),
    today,
  })
  return recordsShareText({
    name,
    lines,
    summary: streakSummary({
      lead: `${solved.length} solved`,
      current,
      longest,
    }),
  })
}

export function puzzleWinShare<T extends number | string>({
  name,
  games,
  options,
  puzzleId,
  moves = false,
  dayOf,
}: {
  name: string
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
  puzzleId: string
  moves?: boolean
  dayOf: (ms: number) => string
}): string | undefined {
  const date = dailyDate(puzzleId)
  return date === null
    ? undefined
    : puzzleDailiesShare({ name, games, options, date, moves, dayOf })
}

export function recordsShareText({
  name,
  lines,
  summary,
}: {
  name: string
  lines: readonly string[]
  summary: string
}): string {
  return `${name} records 🏆\n${lines.map((line) => `${line}\n`).join('')}\n${summary}\n${SHARE_LINK}`
}

export function streakSummary({
  lead,
  current,
  longest,
}: {
  lead: string
  current: number
  longest: number
}): string {
  return `${lead} · 🔥 ${current} · longest 🔥 ${longest}`
}
