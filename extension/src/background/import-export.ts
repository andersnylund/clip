import { browser, Tabs } from 'webextension-polyfill-ts'
import { getBrowserName } from '../browser'
import {
  EXPORT_BOOKMARKS,
  EXPORT_BOOKMARKS_SUCCESS,
  IMPORT_BOOKMARKS,
  IMPORT_BOOKMARKS_SUCCESS,
} from '../message-types'
import { Clip } from '../types'
import * as z from 'zod'

type TabWithId = Tabs.Tab & {
  id: number
}

const insertClip = async (clip: Clip, parentId?: string) => {
  const created = await browser.bookmarks.create({
    parentId,
    title: clip.title,
    url: clip.url || undefined,
  })

  await Promise.all(clip.clips.map(async (c) => insertClip(c, created.id)))
}

interface ImportExportMessage {
  type: string
  payload: unknown
}

/* istanbul ignore next */
export const importExportListener = async (message: ImportExportMessage): Promise<void> => {
  const browserName = getBrowserName()
  if (message.type === IMPORT_BOOKMARKS) {
    const bookmarks = (await browser.bookmarks.getTree())[0]

    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    tabs
      .filter((tab): tab is TabWithId => tab.id !== undefined)
      .map((tab) => {
        browser.tabs.sendMessage(tab.id, { type: IMPORT_BOOKMARKS_SUCCESS, payload: bookmarks })
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

    const rootBookmark = (await browser.bookmarks.getTree())[0]
    const isFirefox = browserName === 'Firefox'

    const bookmarkBar = rootBookmark.children?.find((b) =>
      isFirefox ? b.id === 'toolbar_____' : b.title === 'Bookmarks Bar'
    )

    await Promise.all(
      bookmarkBar?.children?.map(async (child) => {
        await browser.bookmarks.removeTree(child.id)
      }) ?? []
    )

    await Promise.all(
      payload.map(async (clip: Clip) => {
        await insertClip(clip, bookmarkBar?.id)
      })
    )
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    tabs
      .filter((tab): tab is TabWithId => tab.id !== undefined)
      .map((tab) => {
        browser.tabs.sendMessage(tab.id, { type: EXPORT_BOOKMARKS_SUCCESS })
      })
  }
}
