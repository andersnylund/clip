import { mocked } from 'ts-jest/utils'
import { browser } from 'webextension-polyfill-ts'

import './background'

jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
    },
    tabs: {
      query: jest.fn(),
      sendMessage: jest.fn(),
    },
    bookmarks: {
      getTree: jest.fn(),
    },
  },
}))

describe('background.ts', () => {
  beforeEach(() => {
    mocked(browser.tabs.sendMessage).mockClear()
  })
  it('adds event listener to browser runtime onMessage', () => {
    expect(browser.runtime.onMessage.addListener).toHaveBeenCalled()
  })

  it('handles the message', async () => {
    const mockAddListener = mocked(browser.runtime.onMessage.addListener)
    const handler = mockAddListener.mock.calls[0][0]

    mocked(browser.bookmarks.getTree).mockResolvedValue([{ id: 'id', title: 'title' }])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await handler({ type: 'IMPORT_BOOKMARKS' }, {})

    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(1)
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(123, {
      payload: { id: 'id', title: 'title' },
      type: 'IMPORT_BOOKMARKS_SUCCESS',
    })
  })

  it("doesn't handle the message if message type is something else", async () => {
    const mockAddListener = mocked(browser.runtime.onMessage.addListener)
    const handler = mockAddListener.mock.calls[0][0]

    mocked(browser.bookmarks.getTree).mockResolvedValue([{ id: 'id', title: 'title' }])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await handler({ type: 'IMPORT_BOhjghggOKMARKS' }, {})

    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(0)
  })
})
