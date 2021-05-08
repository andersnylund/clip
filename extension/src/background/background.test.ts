import { mocked } from 'ts-jest/utils'
import { browser } from 'webextension-polyfill-ts'
import './background'
import { getBrowserName } from '../browser'
import { firefoxRootBookmark, mockClips, rootChromeBookmark } from '../mock-objects'

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
      removeTree: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('../browser')

describe('background.ts', () => {
  beforeEach(() => {
    mocked(browser.tabs.query).mockClear()
    mocked(browser.tabs.sendMessage).mockClear()
    mocked(browser.bookmarks.getTree).mockClear()
    mocked(browser.bookmarks.removeTree).mockClear()
    mocked(browser.bookmarks.create).mockClear()
    mocked(getBrowserName).mockReturnValue('Firefox')
  })
  it('adds event listener to browser runtime onMessage', () => {
    expect(browser.runtime.onMessage.addListener).toHaveBeenCalled()
  })

  it('handles an export message on firefox', async () => {
    const mockAddListener = mocked(browser.runtime.onMessage.addListener)
    const messageListener = mockAddListener.mock.calls[0][0]

    mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])
    mocked(browser.bookmarks.create).mockResolvedValue({ id: 'id', title: 'title' })

    await messageListener({ type: 'EXPORT_BOOKMARKS', payload: mockClips }, {})

    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(1)
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(123, {
      type: 'EXPORT_BOOKMARKS_SUCCESS',
    })
    expect(browser.bookmarks.create).toHaveBeenCalledTimes(2)
    expect(browser.bookmarks.create).toHaveBeenNthCalledWith(1, {
      parentId: 'toolbar_____',
      title: 'parentTitle',
      url: undefined,
      index: 0,
    })
    expect(browser.bookmarks.removeTree).toHaveBeenCalledTimes(5)
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(1, 'r9XXWlPBCuKr')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(2, 'Z4oGwYBAmnFK')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(3, 'YIQzq0nFaoUf')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(4, 'xRLe8KZfNEEB')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(5, 'Du6LxlaViYtc')
    expect(browser.bookmarks.create).toHaveBeenNthCalledWith(2, {
      parentId: 'id',
      title: 'title',
      url: undefined,
      index: 0,
    })
  })

  it('handles an export message on chrome', async () => {
    mocked(getBrowserName).mockReturnValue('Chrome')

    const mockAddListener = mocked(browser.runtime.onMessage.addListener)
    const messageListener = mockAddListener.mock.calls[0][0]

    mocked(browser.bookmarks.getTree).mockResolvedValue([rootChromeBookmark])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])
    mocked(browser.bookmarks.create).mockResolvedValue({ id: 'createdBookmarkId', title: 'title' })

    await messageListener({ type: 'EXPORT_BOOKMARKS', payload: mockClips }, {})

    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(1)
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(123, {
      type: 'EXPORT_BOOKMARKS_SUCCESS',
    })
    expect(browser.bookmarks.create).toHaveBeenCalledTimes(2)
    expect(browser.bookmarks.create).toHaveBeenNthCalledWith(1, {
      parentId: '1',
      title: 'parentTitle',
      url: undefined,
      index: 0,
    })
    expect(browser.bookmarks.create).toHaveBeenNthCalledWith(2, {
      parentId: 'createdBookmarkId',
      title: 'title',
      url: undefined,
      index: 0,
    })
    expect(browser.bookmarks.removeTree).toHaveBeenCalledTimes(3)
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(1, '7')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(2, '10')
    expect(browser.bookmarks.removeTree).toHaveBeenNthCalledWith(3, '12')
  })

  it('handles an import message', async () => {
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

  it('throws error if payload is not of valid type', async () => {
    const mockAddListener = mocked(browser.runtime.onMessage.addListener)
    const messageListener = mockAddListener.mock.calls[0][0]

    mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])
    mocked(browser.bookmarks.create).mockResolvedValue({ id: 'id', title: 'title' })

    try {
      await messageListener({ type: 'EXPORT_BOOKMARKS', payload: [{}] }, {})
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [Error: [
          {
            "code": "invalid_type",
            "expected": "array",
            "received": "undefined",
            "path": [
              0,
              "clips"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              0,
              "id"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "undefined",
            "path": [
              0,
              "index"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              0,
              "parentId"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              0,
              "title"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              0,
              "url"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "undefined",
            "path": [
              0,
              "userId"
            ],
            "message": "Required"
          }
        ]]
      `)
    }
  })
})
