import { browser } from 'webextension-polyfill-ts'
import './background'
import { exportListener } from './export'
import { importListener } from './import'
import { updateClips } from './native-update'
import { updateSyncStatus } from './sync'

jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
    },
    tabs: {
      onActivated: {
        addListener: jest.fn(),
      },
    },
    windows: {
      onFocusChanged: {
        addListener: jest.fn(),
      },
    },
    bookmarks: {
      onCreated: {
        addListener: jest.fn(),
      },
      onChanged: {
        addListener: jest.fn(),
      },
      onMoved: {
        addListener: jest.fn(),
      },
      onRemoved: {
        addListener: jest.fn(),
      },
    },
  },
}))

describe('background.ts', () => {
  it('adds event listener', () => {
    const addListenerMock = browser.runtime.onMessage.addListener
    expect(addListenerMock).toHaveBeenCalledTimes(2)
    expect(addListenerMock).nthCalledWith(1, exportListener)
    expect(addListenerMock).nthCalledWith(2, importListener)
    expect(browser.tabs.onActivated.addListener).toHaveBeenCalledWith(updateSyncStatus)
    expect(browser.bookmarks.onChanged.addListener).toHaveBeenCalledWith(updateClips)
    expect(browser.bookmarks.onCreated.addListener).toHaveBeenCalledWith(updateClips)
    expect(browser.bookmarks.onMoved.addListener).toHaveBeenCalledWith(updateClips)
    expect(browser.bookmarks.onRemoved.addListener).toHaveBeenCalledWith(updateClips)
  })
})
