import throttle from 'lodash/throttle'
import { browser } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { fetchProfile } from '../../../shared/hooks/useProfile'
import { getBookmarkBar } from './bookmark-bar'
import { emptyBookmarkBar, insertClips } from './export'

// TODO: is there a reason to validate anything with this?
const syncDataSchema = z.object({
  syncEnabled: z.boolean(),
  syncId: z.string().uuid().nullable(),
})

const setSyncData = (data: z.infer<typeof syncDataSchema>) => {
  browser.storage.local.set(data)
}

export const updateSyncStatus = throttle(async () => {
  const { syncId } = await browser.storage.local.get()
  const profile = await fetchProfile()
  if (profile.syncEnabled && profile.syncId !== syncId) {
    const bookmarkBar = await getBookmarkBar()
    await emptyBookmarkBar(bookmarkBar)
    await insertClips(profile.clips, bookmarkBar?.id)
    setSyncData({ syncEnabled: profile.syncEnabled, syncId: profile.syncId })
  }
}, 30_000)

browser.windows.onFocusChanged.addListener(updateSyncStatus)
browser.tabs.onActivated.addListener(updateSyncStatus)
