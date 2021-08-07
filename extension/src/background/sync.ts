import throttle from 'lodash/throttle'
import { browser } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { fetchProfile } from '../../../shared/hooks/useProfile'
import { EXPORT_BOOKMARKS } from '../../../shared/message-types'
import { exportListener } from './export'

// TODO: is there a reason to validate anything with this?
const syncDataSchema = z.object({
  syncEnabled: z.boolean(),
  syncId: z.string().uuid().nullable(),
})

browser.tabs.onActivated.addListener(() => {
  updateSyncStatus()
})

browser.windows.onFocusChanged.addListener(() => {
  updateSyncStatus()
})

const setSyncData = (data: z.infer<typeof syncDataSchema>) => {
  browser.storage.local.set(data)
}

const updateSyncStatus = throttle(async () => {
  const { syncId } = await browser.storage.local.get()
  const profile = await fetchProfile()
  if (profile.syncEnabled && profile.syncId !== syncId) {
    exportListener({ type: EXPORT_BOOKMARKS, payload: profile.clips })
    setSyncData({ syncEnabled: profile.syncEnabled, syncId: profile.syncId })
  }
}, 3000) // TODO: bump this back to 10_000 or something like that
