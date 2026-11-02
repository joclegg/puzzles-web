import { SIGN_IN_PROVIDER } from '@/shared/sync/sync.constants'
import type { SignInProvider } from '@/shared/sync/sync.types'
import { cn } from '@/shared/lib/utils.functions'
import { GoogleLogo } from '@/shared/sync/GoogleLogo/GoogleLogo'
import { MicrosoftLogo } from '@/shared/sync/MicrosoftLogo/MicrosoftLogo'
import {
  PROVIDER_BUTTON_CLASS,
  PROVIDER_BUTTON_LABEL,
} from '@/shared/sync/ProviderButton/ProviderButton.constants'

export function ProviderButton({
  provider,
  onClick,
}: {
  provider: SignInProvider
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex w-full items-center justify-center whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        PROVIDER_BUTTON_CLASS[provider],
      )}
      onClick={onClick}
    >
      {provider === SIGN_IN_PROVIDER.GOOGLE ? (
        <GoogleLogo />
      ) : (
        <MicrosoftLogo />
      )}
      {PROVIDER_BUTTON_LABEL[provider]}
    </button>
  )
}
