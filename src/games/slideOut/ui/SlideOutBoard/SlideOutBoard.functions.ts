export function dragOffset({
  start,
  delta,
  cellSize,
  low,
  high,
}: {
  start: number
  delta: number
  cellSize: number
  low: number
  high: number
}): number {
  return Math.min(
    (high - start) * cellSize,
    Math.max((low - start) * cellSize, delta),
  )
}

export function dragPosition({
  start,
  delta,
  cellSize,
  low,
  high,
}: {
  start: number
  delta: number
  cellSize: number
  low: number
  high: number
}): number {
  const steps = Math.round(delta / cellSize)
  return Math.min(high, Math.max(low, start + steps))
}
