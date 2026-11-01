import type { BANK_LOAD } from '@/components/BankLoader/BankLoader.constants'

export interface BankLoad {
  status: BankLoadStatus
  run: (task: () => Promise<void>) => void
  retry: () => void
  cancel: () => void
}

export type BankLoadStatus = (typeof BANK_LOAD)[keyof typeof BANK_LOAD]
