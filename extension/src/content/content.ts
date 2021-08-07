import { browser } from 'webextension-polyfill-ts'

// forward messages received from background script to frontend
browser.runtime.onMessage.addListener((message) => window.postMessage(message, window.location.toString()))

export const messageEventHandler = (event: MessageEvent): Promise<void> => browser.runtime.sendMessage(event.data)
// forward messages received from the frontend to backend
window.addEventListener('message', messageEventHandler)
