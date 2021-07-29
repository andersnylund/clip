import { browser } from 'webextension-polyfill-ts'
import { sync, syncListener } from './sync'

// forward messages received from background script to frontend
browser.runtime.onMessage.addListener((message) => window.postMessage(message, window.location.toString()))

// listen to sync messages
export const syncEventHandler = (event: MessageEvent): void => syncListener(event.data)
window.addEventListener('message', syncEventHandler)

export const messageEventHandler = (event: MessageEvent): Promise<void> => browser.runtime.sendMessage(event.data)
// forward messages received from the frontend to backend
window.addEventListener('message', messageEventHandler)

// TODO: sync on tab focus
sync()
