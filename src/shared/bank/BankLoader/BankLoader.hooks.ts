import { useRef, useState } from 'react'

import { BANK_LOAD } from '@/shared/bank/BankLoader/BankLoader.constants'
import type {
  BankLoad,
  BankLoadStatus,
} from '@/shared/bank/BankLoader/BankLoader.types'

export function useBankLoader(): BankLoad {
  const [status, setStatus] = useState<BankLoadStatus>(BANK_LOAD.IDLE)
  const taskRef = useRef<(() => Promise<void>) | null>(null)
  const attemptRef = useRef(0)

  function run(task: () => Promise<void>) {
    if (status === BANK_LOAD.LOADING) {
      return
    }
    taskRef.current = task
    attemptRef.current += 1
    const attempt = attemptRef.current
    setStatus(BANK_LOAD.LOADING)
    task().then(
      () => {
        if (attempt === attemptRef.current) setStatus(BANK_LOAD.IDLE)
      },
      () => {
        if (attempt === attemptRef.current) setStatus(BANK_LOAD.FAILED)
      },
    )
  }

  function retry() {
    if (taskRef.current) run(taskRef.current)
  }

  function cancel() {
    attemptRef.current += 1
    setStatus(BANK_LOAD.IDLE)
  }

  return { status, run, retry, cancel }
}
