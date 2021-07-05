import { browser, Tabs } from 'webextension-polyfill-ts'
import { addClip, removeClip } from '../../../shared/clip'
import { getBrowserName } from '../browser'
import { exportListener } from './export'
import { importListener } from './import'

browser.runtime.onMessage.addListener(importListener)
browser.runtime.onMessage.addListener(exportListener)

export type TabWithId = Tabs.Tab & {
  id: number
}

export const FIREFOX_TOOLBAR_ID = 'toolbar_____'
export const CHROMIUM_TOOLBAR_LOWERCASE_NAME = 'bookmarks bar'

export const getToolbarId = (): string =>
  getBrowserName() === 'Firefox' ? FIREFOX_TOOLBAR_ID : CHROMIUM_TOOLBAR_LOWERCASE_NAME

browser.bookmarks.onCreated.addListener(async (id, bookmark) => {
  await addClip({ title: bookmark.title, url: bookmark.url ?? null })
  // TODO: notify webapp of changes and trigger swr mutate there
})

// browser.bookmarks.onChanged.addListener((id, changeInfo) => {
//   console.log('onChanged')
//   console.log('changeInfo', changeInfo)
//   logBookmark(id)
// })

// browser.bookmarks.onMoved.addListener((id, moveInfo) => {
//   console.log('onMoved')
//   console.log('moveInfo', moveInfo)
//   logBookmark(id)
// })

browser.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  // TODO: find the correct webappID of bookmark
  await removeClip(id)
  // TODO: notify webapp of changes and trigger swr mutate there
})

// const logBookmark = async (id: string) => {
//   const bookmark = (await browser.bookmarks.get(id))[0]
//   if (bookmark) {
//     console.log('bookmark', bookmark)
//     const searchresult = await browser.bookmarks.search({ title: bookmark.title, url: bookmark.url })
//     console.log('searchresult', searchresult)
//   }
// }
