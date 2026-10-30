import { SIGN_IN_PROVIDER } from '@/common/sync.constants'
import type { SignInProvider } from '@/common/sync.types'
import { cn } from '@/common/utils.functions'
import { GoogleLogo } from '@/components/GoogleLogo/GoogleLogo'
import { MicrosoftLogo } from '@/components/MicrosoftLogo/MicrosoftLogo'
import {
  PROVIDER_BUTTON_CLASS,
  PROVIDER_BUTTON_LABEL,
} from '@/components/ProviderButton/ProviderButton.constants'

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
