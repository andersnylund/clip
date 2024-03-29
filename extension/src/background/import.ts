import { Bookmarks, browser } from 'webextension-polyfill-ts'
import { IMPORT_BOOKMARKS, IMPORT_BOOKMARKS_ERROR, IMPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { Clip } from '../../../shared/types'
import { TabWithId } from './constants'
import { getBookmarkBar } from './bookmark-bar'

interface ImportMessage {
  type: string
}

type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
}

export const mapBookmarkToClip = (bookmark: Bookmarks.BookmarkTreeNode): SimpleClip => {
  return {
    clips: bookmark.children?.map((b) => mapBookmarkToClip(b)) || [],
    id: bookmark.id,
    index: bookmark.index ?? null,
    parentId: bookmark.parentId ?? null,
    title: bookmark.title,
    url: bookmark.url ?? null,
    collapsed: true,
  }
}

export const importListener = async (message: ImportMessage): Promise<void> => {
  if (message.type === IMPORT_BOOKMARKS) {
    try {
      const bookmarkBar = await getBookmarkBar()
      // TODO: call the import directly from here

      const clips = bookmarkBar?.children?.map(mapBookmarkToClip)

      const tabs = await browser.tabs.query({ active: true, currentWindow: true })

      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: IMPORT_BOOKMARKS_SUCCESS, payload: clips })
        })
    } catch (e) {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })

      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: IMPORT_BOOKMARKS_ERROR })
        })
      throw e
    }
  }
}

browser.runtime.onMessage.addListener(importListener)
