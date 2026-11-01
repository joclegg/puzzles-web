export function StatFigure({
  value,
  label,
}: {
  value: string | number
  label: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="text-2xl font-semibold" aria-label={label}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
