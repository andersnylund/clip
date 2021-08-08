import { browser, Bookmarks } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { EXPORT_BOOKMARKS, EXPORT_BOOKMARKS_ERROR, EXPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { Clip } from '../../../shared/types'
import { getBookmarkBar } from './bookmark-bar'
import { TabWithId } from './constants'

export const clipSchema = z.array(
  z.object({
    clips: z.array(z.any()),
    id: z.string(),
    index: z.number().nullable(),
    parentId: z.string().nullable(),
    title: z.string(),
    url: z.string().nullable(),
    userId: z.number(),
    collapsed: z.boolean(),
  })
)

const validatePayload = (payload: unknown): z.infer<typeof clipSchema> => {
  const result = clipSchema.parse(payload)
  result.map((clip) => validatePayload(clip.clips))
  return result
}

export const insertClips = async (clips: Clip[], parentId?: string): Promise<void> => {
  await clips.reduce(async (previousPromise, clip, index) => {
    await previousPromise
    const created = await browser.bookmarks.create({
      parentId,
      title: clip.title,
      index,
      url: clip.url ?? undefined,
    })
    return insertClips(clip.clips, created?.id)
  }, Promise.resolve())
}

export const emptyBookmarkBar = async (bookmarkBar: Bookmarks.BookmarkTreeNode | undefined): Promise<void> => {
  await Promise.all(
    bookmarkBar?.children?.map(async (child) => {
      await browser.bookmarks.removeTree(child.id)
    }) ?? []
  )
}

interface ExportMessage {
  type: string
  payload: unknown
}

export const exportListener = async (message: ExportMessage): Promise<void> => {
  if (message.type === EXPORT_BOOKMARKS) {
    try {
      const payload: Clip[] = validatePayload(message.payload)

      const bookmarkBar = await getBookmarkBar()
      await emptyBookmarkBar(bookmarkBar)

      await insertClips(payload, bookmarkBar?.id)

      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: EXPORT_BOOKMARKS_SUCCESS })
        })
    } catch (e) {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: EXPORT_BOOKMARKS_ERROR })
        })
      throw e
    }
  }
}

browser.runtime.onMessage.addListener(exportListener)
