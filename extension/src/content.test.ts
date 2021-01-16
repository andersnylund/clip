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

  it('handles the correct window postMessage event', () => {
    const mockedAddListener = mocked(browser.runtime.onMessage.addListener)
    expect(mockedAddListener).toHaveBeenCalledTimes(1)
    const listener = mockedAddListener.mock.calls[0][0]

    listener({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, undefined)

    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, 'http://localhost/')
  })

  it('does not handle if message event type does not match', () => {
    const mockedAddListener = mocked(browser.runtime.onMessage.addListener)
    const listener = mockedAddListener.mock.calls[0][0]

    listener({ type: 'SOME_OTHER_EVENT' }, undefined)

    expect(postMessageSpy).not.toHaveBeenCalled()
  })

  it('calls the sendMessage when receiving correct message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: 'IMPORT_BOOKMARKS' } }))
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS' })
  })

  it('does not call the sendMessage when receiving invalid type of message', async () => {
    await messageEventHandler(new MessageEvent('message', { data: { type: 'SOME_OTHER_MESSAGE' } }))
    expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
  })
})
