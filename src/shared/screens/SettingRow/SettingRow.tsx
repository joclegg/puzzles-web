import { Switch } from '@base-ui/react/switch'

export function SettingRow({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string
  detail?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-4 py-3">
      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        {detail && (
          <span className="block text-sm text-muted-foreground">{detail}</span>
        )}
      </span>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 shrink-0 rounded-full bg-muted ring-1 ring-border transition-colors data-checked:bg-game"
      >
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-background shadow transition-transform data-checked:translate-x-5.5" />
      </Switch.Root>
    </label>
  )
}
