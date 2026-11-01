import { LAUNCHER_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { DeleteAccount } from '@/components/DeleteAccount/DeleteAccount'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { ThemePicker } from '@/components/ThemePicker/ThemePicker'

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
