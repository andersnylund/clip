import { browser } from 'webextension-polyfill-ts'
import { z } from 'zod'
import { ADD_CLIP, ADD_CLIP_ERROR, ADD_CLIP_SUCCESS } from '../message-types'
import { TabWithId } from './background'
import { getBookmarkBar } from './bookmark-bar'

const createClipSchema = z.object({
  index: z.number().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  parentId: z.string().optional(),
})

interface AddClipMessage {
  type: string
  payload: unknown
}

export const addClipListener = async (message: AddClipMessage): Promise<void> => {
  console.log('message', message)
  if (message.type === ADD_CLIP) {
    try {
      const bookmarkBar = await getBookmarkBar()

      const clip = createClipSchema.parse(message.payload)

      const created = await browser.bookmarks.create({
        index: clip.index,
        url: clip.url,
        title: clip.title,
        parentId: bookmarkBar?.id,
      })
      console.log('created', created)

      const tabs = await browser.tabs.query({ active: true, currentWindow: true })

      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: ADD_CLIP_SUCCESS })
        })
    } catch (e) {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })

      tabs
        .filter((tab): tab is TabWithId => tab.id !== undefined)
        .map((tab) => {
          browser.tabs.sendMessage(tab.id, { type: ADD_CLIP_ERROR })
        })
      throw e
    }
  }
}
