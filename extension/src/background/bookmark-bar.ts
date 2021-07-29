import { Bookmarks, browser } from 'webextension-polyfill-ts'
import { getBrowserName } from '../browser'
import { CHROMIUM_TOOLBAR_LOWERCASE_NAME, FIREFOX_TOOLBAR_ID } from './constants'
import { filterBookmark } from './filter'

export const getBookmarkBar = async (): Promise<Bookmarks.BookmarkTreeNode | undefined> => {
  const browserName = getBrowserName()
  const rootBookmark = (await browser.bookmarks.getTree())[0]

  const isFirefox = browserName === 'Firefox'
  const bookmarkBar = filterBookmark(
    rootBookmark.children?.find((b) =>
      isFirefox ? b.id === FIREFOX_TOOLBAR_ID : b.title.toLowerCase() === CHROMIUM_TOOLBAR_LOWERCASE_NAME
    )
  )
  return bookmarkBar
}
