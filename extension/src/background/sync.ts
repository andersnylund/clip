import throttle from 'lodash/throttle'
import { browser } from 'webextension-polyfill-ts'
import { fetchProfile } from '../../../shared/hooks/useProfile'
import { getBookmarkBar } from './bookmark-bar'
import { emptyBookmarkBar, insertClips } from './export'
import { addAllBookmarkListeners, removeAllBookmarkListeners } from './native-update'

const setSyncData = (data: { syncEnabled: boolean; syncId: string | null }) => {
  browser.storage.local.set(data)
}

export const updateSyncStatus = throttle(async () => {
  const { syncId } = await browser.storage.local.get()
  const profile = await fetchProfile()
  if (profile.syncEnabled && profile.syncId !== syncId) {
    const bookmarkBar = await getBookmarkBar()
    removeAllBookmarkListeners()
    await emptyBookmarkBar(bookmarkBar)
    await insertClips(profile.clips, bookmarkBar?.id)
    addAllBookmarkListeners()
    setSyncData({ syncEnabled: profile.syncEnabled, syncId: profile.syncId })
  }
}, 5_000)

browser.windows.onFocusChanged.addListener(updateSyncStatus)
browser.tabs.onActivated.addListener(updateSyncStatus)
