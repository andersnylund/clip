import { browser } from 'webextension-polyfill-ts'

browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'IMPORT_BOOKMARKS') {
    const bookmarks = (await browser.bookmarks.getTree())[0]

    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    tabs.map((tab) => {
      browser.tabs.sendMessage(tab.id, { type: 'IMPORT_BOOKMARKS_SUCCESS', payload: bookmarks })
    })
  }
})
