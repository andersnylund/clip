import { browser } from 'webextension-polyfill-ts'

// messages received from background script
browser.runtime.onMessage.addListener((message) => window.postMessage(message, window.location.toString()))

export const messageEventHandler = (event: MessageEvent): Promise<void> => browser.runtime.sendMessage(event.data)
// messages received from the frontend
window.addEventListener('message', messageEventHandler)
