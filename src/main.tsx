import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { legacySettingsToKeep } from '@/common/legacySettings.functions'
import { replaceStored } from '@/common/storage.functions'
import { AppView } from '@/views/AppView/AppView'
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
