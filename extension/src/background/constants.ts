import { Tabs } from 'webextension-polyfill-ts'

export type TabWithId = Tabs.Tab & {
  id: number
}

export const FIREFOX_TOOLBAR_ID = 'toolbar_____'
export const CHROMIUM_TOOLBAR_LOWERCASE_NAME = 'bookmarks bar'
