import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { legacySettingsToKeep } from '@/shared/storage/legacySettings.functions'
import { replaceStored } from '@/shared/storage/storage.functions'
import { AppView } from '@/app/AppView/AppView'
import '@/index.css'

for (const { key, value } of legacySettingsToKeep((key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
})) {
  replaceStored({ key, value })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppView />
  </StrictMode>,
)
