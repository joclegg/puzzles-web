const MS_PER_DAY = 86_400_000

export function addDays({ date, days }: { date: string; days: number }) {
  return toIsoDate(new Date(toUtcMs(date) + days * MS_PER_DAY))
}

export function daysBetween({ from, to }: { from: string; to: string }) {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY)
}

export function epochDay(date: string): number {
  return Math.round(toUtcMs(date) / MS_PER_DAY)
}

export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function toUtcMs(date: string): number {
  return Date.parse(`${date}T00:00:00Z`)
}
