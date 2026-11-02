const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function formatDateTime(ms: number): string {
  const date = new Date(ms)
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${time}`
}

export function formatDayMonth(isoDate: string): string {
  const [, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
