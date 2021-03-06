import { browser } from 'webextension-polyfill-ts'
import { mocked } from 'ts-jest/utils/index'

import { messageEventHandler } from './content'

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

    listener({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, {})

    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, 'http://localhost/')
  })

  it('handles a export bookmark postMessage event', () => {
    const mockedAddListener = mocked(browser.runtime.onMessage.addListener)
    expect(mockedAddListener).toHaveBeenCalledTimes(1)
    const listener = mockedAddListener.mock.calls[0][0]

    listener({ type: 'EXPORT_BOOKMARKS_SUCCESS' }, {})

    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'EXPORT_BOOKMARKS_SUCCESS' }, 'http://localhost/')
  })

  it('calls the sendMessage when receiving correct import message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: 'IMPORT_BOOKMARKS' } }))
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS' })
  })

  it('calls the sendMessage when receiving correct export message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: 'EXPORT_BOOKMARKS', clips: [] } }))
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ type: 'EXPORT_BOOKMARKS', clips: [] })
  })
})
