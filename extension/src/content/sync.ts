import { browser } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { fetchProfile } from '../../../shared/hooks/useProfile'
import { EXPORT_BOOKMARKS, TOGGLE_SYNC } from '../../../shared/message-types'

const syncDataSchema = z.object({
  syncEnabled: z.boolean(),
  syncId: z.string().uuid().nullable(),
})

interface SyncMessage {
  type: string
  payload: unknown
}

const setSyncData = (data: z.infer<typeof syncDataSchema>) => {
  browser.storage.local.set(data)
}

export const syncListener = (message: SyncMessage): void => {
  if (message.type === TOGGLE_SYNC) {
    const syncData = syncDataSchema.parse(message.payload)
    setSyncData(syncData)
  }
}

export const sync = async (): Promise<void> => {
  const { syncId } = await browser.storage.local.get()
  const profile = await fetchProfile()
  if (profile.syncEnabled && profile.syncId !== syncId) {
    // TODO: show synced toast, not export toast
    browser.runtime.sendMessage({ type: EXPORT_BOOKMARKS, payload: profile.clips })
    setSyncData({ syncEnabled: profile.syncEnabled, syncId: profile.syncId })
  }
}
