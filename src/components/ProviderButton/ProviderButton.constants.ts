import { SIGN_IN_PROVIDER } from '@/common/sync.constants'
import type { SignInProvider } from '@/common/sync.types'

export const PROVIDER_BUTTON_CLASS: Record<SignInProvider, string> = {
  [SIGN_IN_PROVIDER.GOOGLE]:
    "h-10 gap-2.5 rounded border border-[#747775] bg-white px-3 font-['Roboto',sans-serif] text-sm font-medium text-[#1F1F1F] hover:bg-[#F8F9FA] dark:border-[#8E918F] dark:bg-[#131314] dark:text-[#E3E3E3] dark:hover:bg-[#1F1F20]",
  [SIGN_IN_PROVIDER.MICROSOFT]:
    "h-[41px] gap-3 border border-[#8C8C8C] bg-white px-3 font-['Segoe_UI','Segoe_UI_Web',system-ui,sans-serif] text-[15px] font-semibold text-[#5E5E5E] hover:bg-[#F3F3F3] dark:border-[#2F2F2F] dark:bg-[#2F2F2F] dark:text-white dark:hover:bg-[#3B3B3B]",
}

export const PROVIDER_BUTTON_LABEL: Record<SignInProvider, string> = {
  [SIGN_IN_PROVIDER.GOOGLE]: 'Sign in with Google',
  [SIGN_IN_PROVIDER.MICROSOFT]: 'Sign in with Microsoft',
}
