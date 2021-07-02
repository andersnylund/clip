import { mocked } from 'ts-jest/utils'
import { browser } from 'webextension-polyfill-ts'
import { importListener } from './import'
import { getBrowserName } from '../browser'
import { firefoxRootBookmark, rootChromeBookmark } from '../mock-objects'

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

describe('import.ts', () => {
  beforeEach(() => {
    mocked(browser.tabs.query).mockClear()
    mocked(browser.tabs.sendMessage).mockClear()
    mocked(browser.bookmarks.getTree).mockClear()
    mocked(browser.bookmarks.removeTree).mockClear()
    mocked(browser.bookmarks.create).mockClear()
    mocked(getBrowserName).mockReturnValue('Firefox')
  })

  it('handles an firefox import message', async () => {
    mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await importListener({ type: 'IMPORT_BOOKMARKS' })

    const mockSendMessage = mocked(browser.tabs.sendMessage)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(mockSendMessage.mock.calls[0][0]).toEqual(123)
    expect(mockSendMessage.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "payload": Array [
    Object {
      "clips": Array [
        Object {
          "clips": Array [],
          "collapsed": true,
          "id": "BdsM04swGwWH",
          "index": 0,
          "parentId": "r9XXWlPBCuKr",
          "title": "clip.so – Share your clips",
          "url": "http://localhost:3000/clips",
        },
        Object {
          "clips": Array [
            Object {
              "clips": Array [
                Object {
                  "clips": Array [],
                  "collapsed": true,
                  "id": "1C0zEWb_cqVk",
                  "index": 0,
                  "parentId": "e6sbm4i5XjLC",
                  "title": "google",
                  "url": "https://google.com/",
                },
              ],
              "collapsed": true,
              "id": "e6sbm4i5XjLC",
              "index": 0,
              "parentId": "R_El0H_RQrjO",
              "title": "aaargh",
              "url": null,
            },
          ],
          "collapsed": true,
          "id": "R_El0H_RQrjO",
          "index": 1,
          "parentId": "r9XXWlPBCuKr",
          "title": "clipception",
          "url": null,
        },
      ],
      "collapsed": true,
      "id": "r9XXWlPBCuKr",
      "index": 0,
      "parentId": "toolbar_____",
      "title": "testing",
      "url": null,
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "Z4oGwYBAmnFK",
      "index": 1,
      "parentId": "toolbar_____",
      "title": "clip.so – Share your clips",
      "url": "http://localhost:3000/clips",
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "YIQzq0nFaoUf",
      "index": 2,
      "parentId": "toolbar_____",
      "title": "nothing",
      "url": null,
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "xRLe8KZfNEEB",
      "index": 3,
      "parentId": "toolbar_____",
      "title": "testing",
      "url": "http://asdf/",
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "Du6LxlaViYtc",
      "index": 4,
      "parentId": "toolbar_____",
      "title": "asöldkasöldk",
      "url": null,
    },
  ],
  "type": "IMPORT_BOOKMARKS_SUCCESS",
}
`)
  })

  it('filters out firefox separators on import', async () => {
    mocked(browser.bookmarks.getTree).mockResolvedValue([
      {
        id: 'root________',
        title: '',
        index: 0,
        dateAdded: 1610199885106,
        type: 'folder',
        dateGroupModified: 1613247249892,
        children: [
          {
            id: 'toolbar_____',
            title: 'Bookmarks Toolbar',
            index: 1,
            dateAdded: 1610199885106,
            type: 'folder',
            parentId: 'root________',
            dateGroupModified: 1613247249892,
            children: [{ id: 'separator', title: 'separator', type: 'separator' }],
          },
        ],
      },
    ])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await importListener({ type: 'IMPORT_BOOKMARKS' })

    const mockSendMessage = mocked(browser.tabs.sendMessage)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).toHaveBeenCalledWith(123, { payload: [], type: 'IMPORT_BOOKMARKS_SUCCESS' })
  })

  it('handles an import on chrome', async () => {
    mocked(getBrowserName).mockReturnValue('Chrome')

    mocked(browser.bookmarks.getTree).mockResolvedValue([rootChromeBookmark])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await importListener({ type: 'IMPORT_BOOKMARKS' })

    const mockSendMessage = mocked(browser.tabs.sendMessage)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(mockSendMessage.mock.calls[0][0]).toEqual(123)
    expect(mockSendMessage.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "payload": Array [
    Object {
      "clips": Array [
        Object {
          "clips": Array [],
          "collapsed": true,
          "id": "8",
          "index": 0,
          "parentId": "7",
          "title": "google",
          "url": "https://google.com/",
        },
        Object {
          "clips": Array [
            Object {
              "clips": Array [],
              "collapsed": true,
              "id": "5",
              "index": 0,
              "parentId": "9",
              "title": "clip.so – Share your clips",
              "url": "http://localhost:3000/clips",
            },
          ],
          "collapsed": true,
          "id": "9",
          "index": 1,
          "parentId": "7",
          "title": "clipception",
          "url": null,
        },
      ],
      "collapsed": true,
      "id": "7",
      "index": 0,
      "parentId": "1",
      "title": "testing",
      "url": null,
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "10",
      "index": 1,
      "parentId": "1",
      "title": "nothing",
      "url": null,
    },
    Object {
      "clips": Array [],
      "collapsed": true,
      "id": "12",
      "index": 2,
      "parentId": "1",
      "title": "asöldkaölskd",
      "url": null,
    },
  ],
  "type": "IMPORT_BOOKMARKS_SUCCESS",
}
`)
  })

  it("doesn't handle the message if message type is something else", async () => {
    mocked(browser.bookmarks.getTree).mockResolvedValue([{ id: 'id', title: 'title' }])
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    await importListener({ type: 'IMPORT_BOhjghggOKMARKS' })

    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(0)
  })

  it('sends an error message if import fails', async () => {
    mocked(browser.bookmarks.getTree).mockRejectedValue(new Error('hehe'))
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 1, pinned: false, id: 123 },
    ])

    try {
      await importListener({ type: 'IMPORT_BOOKMARKS' })
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: hehe]`)
    }
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(123, { type: 'IMPORT_BOOKMARKS_ERROR' })
  })
})
