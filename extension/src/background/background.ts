import { browser } from 'webextension-polyfill-ts'
import { getBrowserName } from '../browser'
import {
  EXPORT_BOOKMARKS,
  EXPORT_BOOKMARKS_SUCCESS,
  IMPORT_BOOKMARKS,
  IMPORT_BOOKMARKS_SUCCESS,
} from '../message-types'
import { Clip } from '../types'

const insertClip = async (clip: Clip, parentId?: string) => {
  const created = await browser.bookmarks.create({
    parentId,
    title: clip.title,
    url: clip.url,
  })

  await Promise.all(clip.clips.map(async (c) => insertClip(c, created.id)))
}

browser.runtime.onMessage.addListener(async (message) => {
  const browserName = getBrowserName()
  if (message.type === IMPORT_BOOKMARKS) {
    const bookmarks = (await browser.bookmarks.getTree())[0]

    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    tabs.map((tab) => {
      browser.tabs.sendMessage(tab.id, { type: IMPORT_BOOKMARKS_SUCCESS, payload: bookmarks })
    })
  }
  if (message.type === EXPORT_BOOKMARKS) {
    const rootBookmark = (await browser.bookmarks.getTree())[0]
    const isFirefox = browserName === 'Firefox'

    const bookmarkBar = rootBookmark.children.find((b) =>
      isFirefox ? b.id === 'toolbar_____' : b.title === 'Bookmarks Bar'
    )

    await Promise.all(
      bookmarkBar.children.map(async (child) => {
        await browser.bookmarks.removeTree(child.id)
      })
    )

    await Promise.all(
      message.payload.map(async (clip: Clip) => {
        await insertClip(clip, bookmarkBar.id)
      })
    )
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    tabs.map((tab) => {
      browser.tabs.sendMessage(tab.id, { type: EXPORT_BOOKMARKS_SUCCESS })
    })
  }
})
