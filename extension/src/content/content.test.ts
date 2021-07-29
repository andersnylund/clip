import { mocked } from 'ts-jest/utils/index'
import { browser } from 'webextension-polyfill-ts'
import {
  EXPORT_BOOKMARKS,
  EXPORT_BOOKMARKS_SUCCESS,
  IMPORT_BOOKMARKS,
  IMPORT_BOOKMARKS_SUCCESS,
  TOGGLE_SYNC,
} from '../../../shared/message-types'
import { messageEventHandler, syncEventHandler } from './content'
import { sync, syncListener } from './sync'

jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
      sendMessage: jest.fn(),
    },
  },
}))

jest.mock('./sync')

describe('content.ts', () => {
  let postMessageSpy: jest.SpyInstance

  beforeEach(() => {
    postMessageSpy = jest.spyOn(window, 'postMessage')
    postMessageSpy.mockClear()
    mocked(browser.runtime.sendMessage).mockClear()
  })

  it('handles a import bookmark postMessage event', () => {
    const mockedAddListener = mocked(browser.runtime.onMessage.addListener)
    expect(mockedAddListener).toHaveBeenCalledTimes(1)
    const listener = mockedAddListener.mock.calls[0][0]

    listener({ type: IMPORT_BOOKMARKS_SUCCESS }, {})

    expect(postMessageSpy).toHaveBeenCalledWith({ type: IMPORT_BOOKMARKS_SUCCESS }, 'http://localhost/')
  })

  it('handles a export bookmark postMessage event', () => {
    const mockedAddListener = mocked(browser.runtime.onMessage.addListener)
    expect(mockedAddListener).toHaveBeenCalledTimes(1)
    const listener = mockedAddListener.mock.calls[0][0]

    listener({ type: EXPORT_BOOKMARKS_SUCCESS }, {})

    expect(postMessageSpy).toHaveBeenCalledWith({ type: EXPORT_BOOKMARKS_SUCCESS }, 'http://localhost/')
  })

  it('calls the sendMessage when receiving correct import message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: IMPORT_BOOKMARKS } }))
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ type: IMPORT_BOOKMARKS })
  })

  it('calls the sendMessage when receiving correct export message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: EXPORT_BOOKMARKS, clips: [] } }))
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ type: EXPORT_BOOKMARKS, clips: [] })
  })

  it('calls sync on load', () => {
    const mockSync = mocked(sync)
    expect(mockSync).toHaveBeenCalledTimes(1)
  })

  describe('syncEventHandler', () => {
    it('forwards the message', () => {
      syncEventHandler(new MessageEvent('message', { data: { type: TOGGLE_SYNC } }))
      const mockSyncListener = mocked(syncListener)
      expect(mockSyncListener).toHaveBeenCalledWith({ type: TOGGLE_SYNC })
    })
  })
})
