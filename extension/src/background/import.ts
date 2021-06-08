import { browser } from 'webextension-polyfill-ts'
import { IMPORT_BOOKMARKS, IMPORT_BOOKMARKS_ERROR, IMPORT_BOOKMARKS_SUCCESS } from '../message-types'
import { Clip } from '../types'
import { TabWithId } from './background'
import { getBookmarkBar } from './bookmark-bar'

interface ImportExportMessage {
  type: string
  payload: unknown
}

type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
}

const mapBookmarkToClip = (bookmark: chrome.bookmarks.BookmarkTreeNode): SimpleClip => {
  return {
    clips: bookmark.children?.map((b) => mapBookmarkToClip(b)) || [],
    id: bookmark.id,
    index: bookmark.index ?? null,
    parentId: bookmark.parentId ?? null,
    title: bookmark.title,
    url: bookmark.url ?? null,
  }
}

export const importListener = async (message: ImportExportMessage): Promise<void> => {
  if (message.type === IMPORT_BOOKMARKS) {
    try {
      const bookmarkBar = await getBookmarkBar()

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