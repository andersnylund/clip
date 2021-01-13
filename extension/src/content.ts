import { browser } from 'webextension-polyfill-ts'

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'IMPORT_BOOKMARKS_SUCCESS') {
    window.postMessage(message, window.location.toString())
  }
})

export const messageEventHandler = async (event: MessageEvent): Promise<void> => {
  if (event.data.type === 'IMPORT_BOOKMARKS') {
    await browser.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS' })
  }
}

window.addEventListener('message', messageEventHandler)
