import { LAUNCHER_ROUTE } from '@/shared/lib/route.constants'
import type { Account } from '@/shared/sync/sync.types'
import { DeleteAccount } from '@/shared/sync/DeleteAccount/DeleteAccount'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { ThemePicker } from '@/shared/ui/ThemePicker/ThemePicker'

export function GeneralSettingsView({ account }: { account: Account }) {
  return (
    <SettingsScreen game={LAUNCHER_ROUTE.SETTINGS}>
      <ThemePicker />
      <p className="text-sm text-muted-foreground">Applies to every game.</p>
      {account.email !== null && (
        <DeleteAccount onDeleteAccount={account.onDeleteAccount} />
      )}
    </SettingsScreen>
  )
}
