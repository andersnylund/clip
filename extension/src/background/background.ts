import { browser, Tabs } from 'webextension-polyfill-ts'
import { exportListener } from './export'
import { importListener } from './import'

browser.runtime.onMessage.addListener(importListener)
browser.runtime.onMessage.addListener(exportListener)

export type TabWithId = Tabs.Tab & {
  id: number
}

export const FIREFOX_TOOLBAR_ID = 'toolbar_____'
export const CHROMIUM_TOOLBAR_LOWERCASE_NAME = 'bookmarks bar'
