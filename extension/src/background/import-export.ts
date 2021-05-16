import { Bookmarks, browser, Tabs } from 'webextension-polyfill-ts'
import * as z from 'zod'
import { getBrowserName } from '../browser'
import {
  EXPORT_BOOKMARKS,
  EXPORT_BOOKMARKS_SUCCESS,
  IMPORT_BOOKMARKS,
  IMPORT_BOOKMARKS_SUCCESS,
} from '../message-types'
import { Clip } from '../types'
import { filterBookmark } from './filter'

type TabWithId = Tabs.Tab & {
  id: number
}

const FIREFOX_TOOLBAR_ID = 'toolbar_____'
const CHROMIUM_TOOLBAR_LOWERCASE_NAME = 'bookmarks bar'

const insertClip = async (clip: Clip, index: number, parentId?: string) => {
  const created = await browser.bookmarks.create({
    parentId,
    title: clip.title,
    index,
    url: clip.url ?? undefined,
  })
  await clip.clips.reduce(async (previousPromise, c, index) => {
    await previousPromise
    return insertClip(c, index, created.id)
  }, Promise.resolve())
}

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

export const importExportListener = async (message: ImportExportMessage): Promise<void> => {
  if (message.type === IMPORT_BOOKMARKS) {
    const bookmarkBar = await getBookmarkBar()

    const clips = bookmarkBar?.children?.map(mapBookmarkToClip)

    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    tabs
      .filter((tab): tab is TabWithId => tab.id !== undefined)
      .map((tab) => {
        browser.tabs.sendMessage(tab.id, { type: IMPORT_BOOKMARKS_SUCCESS, payload: clips })
      })
  }
  if (message.type === EXPORT_BOOKMARKS) {
    const clipSchema = z.array(
      z.object({
        clips: z.array(z.any()),
        id: z.string(),
        index: z.number().nullable(),
        parentId: z.string().nullable(),
        title: z.string(),
        url: z.string().nullable(),
        userId: z.number(),
      })
    )

    const payload = clipSchema.parse(message.payload)

    const bookmarkBar = await getBookmarkBar()

    await Promise.all(
      bookmarkBar?.children?.map(async (child) => {
        await browser.bookmarks.removeTree(child.id)
      }) ?? []
    )

    await payload.reduce(async (previousPromise, clip: Clip, index) => {
      await previousPromise
      return insertClip(clip, index, bookmarkBar?.id)
    }, Promise.resolve())

    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    tabs
      .filter((tab): tab is TabWithId => tab.id !== undefined)
      .map((tab) => {
        browser.tabs.sendMessage(tab.id, { type: EXPORT_BOOKMARKS_SUCCESS })
      })
  }
}
