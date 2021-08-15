import { browser } from 'webextension-polyfill-ts'
import { getAppUrl } from '../../../shared/app-url'
import { getBookmarkBar } from './bookmark-bar'
import { mapBookmarkToClip } from './import'

const updateClips = async () => {
  const bookmarkBar = await getBookmarkBar()
  const clips = bookmarkBar?.children?.map(mapBookmarkToClip) ?? []
  fetch(`${getAppUrl()}/api/clips/import`, {
    method: 'POST',
    body: JSON.stringify(clips),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const removeAllBookmarkListeners = (): void => {
  browser.bookmarks.onCreated.removeListener(updateClips)
  browser.bookmarks.onChanged.removeListener(updateClips)
  browser.bookmarks.onMoved.removeListener(updateClips)
  browser.bookmarks.onRemoved.removeListener(updateClips)
}

export const addAllBookmarkListeners = (): void => {
  browser.bookmarks.onCreated.addListener(updateClips)
  browser.bookmarks.onChanged.addListener(updateClips)
  browser.bookmarks.onMoved.addListener(updateClips)
  browser.bookmarks.onRemoved.addListener(updateClips)
}

addAllBookmarkListeners()
