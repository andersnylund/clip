import { browser } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { EXPORT_BOOKMARKS, EXPORT_BOOKMARKS_ERROR, EXPORT_BOOKMARKS_SUCCESS } from '../message-types'
import { Clip } from '../types'
import { TabWithId } from './background'
import { getBookmarkBar } from './bookmark-bar'

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

interface ImportExportMessage {
  type: string
  payload: unknown
}

export const exportListener = async (message: ImportExportMessage): Promise<void> => {
  if (message.type === EXPORT_BOOKMARKS) {
    try {
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