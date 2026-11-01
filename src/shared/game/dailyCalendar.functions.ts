const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function addMonths({ month, count }: { month: string; count: number }) {
  const [year, index] = month.split('-').map(Number)
  const total = year * 12 + index - 1 + count
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`
}

export function monthDays(month: string): (string | null)[] {
  const [year, index] = month.split('-').map(Number)
  const first = new Date(Date.UTC(year, index - 1, 1))
  const days = new Date(Date.UTC(year, index, 0)).getUTCDate()
  const lead = (first.getUTCDay() + 6) % 7
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: days },
      (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`,
    ),
  ]
}

export function monthLabel(month: string): string {
  const [year, index] = month.split('-').map(Number)
  return `${MONTH_NAMES[index - 1]} ${year}`
}
