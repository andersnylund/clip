import { mocked } from 'ts-jest/utils'
import { browser } from 'webextension-polyfill-ts'
import { getBrowserName } from '../browser'
import { firefoxRootBookmark, rootBraveBookmark, rootChromeBookmark } from '../mock-objects'
import { getBookmarkBar } from './import-export'

jest.mock('../browser')

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

describe('import-export', () => {
  describe('getBookmarkBar', () => {
    it('handles getting firefox bookmark bar', async () => {
      mocked(getBrowserName).mockReturnValue('Firefox')
      mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
      const bookmarkBar = await getBookmarkBar()
      expect(bookmarkBar).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "dateAdded": 1610201697594,
                  "id": "BdsM04swGwWH",
                  "index": 0,
                  "parentId": "r9XXWlPBCuKr",
                  "title": "clip.so – Share your clips",
                  "type": "bookmark",
                  "url": "http://localhost:3000/clips",
                },
                Object {
                  "children": Array [
                    Object {
                      "children": Array [
                        Object {
                          "dateAdded": 1610811425583,
                          "id": "1C0zEWb_cqVk",
                          "index": 0,
                          "parentId": "e6sbm4i5XjLC",
                          "title": "google",
                          "type": "bookmark",
                          "url": "https://google.com/",
                        },
                      ],
                      "dateAdded": 1613242587384,
                      "dateGroupModified": 1613242597434,
                      "id": "e6sbm4i5XjLC",
                      "index": 0,
                      "parentId": "R_El0H_RQrjO",
                      "title": "aaargh",
                      "type": "folder",
                    },
                  ],
                  "dateAdded": 1610811412833,
                  "dateGroupModified": 1613242597434,
                  "id": "R_El0H_RQrjO",
                  "index": 1,
                  "parentId": "r9XXWlPBCuKr",
                  "title": "clipception",
                  "type": "folder",
                },
              ],
              "dateAdded": 1610201692275,
              "dateGroupModified": 1613242597434,
              "id": "r9XXWlPBCuKr",
              "index": 0,
              "parentId": "toolbar_____",
              "title": "testing",
              "type": "folder",
            },
            Object {
              "dateAdded": 1610201744501,
              "id": "Z4oGwYBAmnFK",
              "index": 1,
              "parentId": "toolbar_____",
              "title": "clip.so – Share your clips",
              "type": "bookmark",
              "url": "http://localhost:3000/clips",
            },
            Object {
              "children": Array [],
              "dateAdded": 1610812338455,
              "dateGroupModified": 1610812340098,
              "id": "YIQzq0nFaoUf",
              "index": 2,
              "parentId": "toolbar_____",
              "title": "nothing",
              "type": "folder",
            },
            Object {
              "dateAdded": 1610812440156,
              "id": "xRLe8KZfNEEB",
              "index": 3,
              "parentId": "toolbar_____",
              "title": "testing",
              "type": "bookmark",
              "url": "http://asdf/",
            },
            Object {
              "children": Array [],
              "dateAdded": 1613247249892,
              "dateGroupModified": 1613247251145,
              "id": "Du6LxlaViYtc",
              "index": 4,
              "parentId": "toolbar_____",
              "title": "asöldkasöldk",
              "type": "folder",
            },
          ],
          "dateAdded": 1610199885106,
          "dateGroupModified": 1613247249892,
          "id": "toolbar_____",
          "index": 1,
          "parentId": "root________",
          "title": "Bookmarks Toolbar",
          "type": "folder",
        }
      `)
    })

    it('handles getting chrome bookmark bar', async () => {
      mocked(getBrowserName).mockReturnValue('Chrome')
      mocked(browser.bookmarks.getTree).mockResolvedValue([rootChromeBookmark])
      const bookmarkBar = await getBookmarkBar()
      expect(bookmarkBar).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "dateAdded": 1610811968618,
                  "id": "8",
                  "index": 0,
                  "parentId": "7",
                  "title": "google",
                  "url": "https://google.com/",
                },
                Object {
                  "children": Array [
                    Object {
                      "dateAdded": 1610201629261,
                      "id": "5",
                      "index": 0,
                      "parentId": "9",
                      "title": "clip.so – Share your clips",
                      "url": "http://localhost:3000/clips",
                    },
                  ],
                  "dateAdded": 1610811985144,
                  "dateGroupModified": 1610811993212,
                  "id": "9",
                  "index": 1,
                  "parentId": "7",
                  "title": "clipception",
                },
              ],
              "dateAdded": 1610811951364,
              "dateGroupModified": 1610811985144,
              "id": "7",
              "index": 0,
              "parentId": "1",
              "title": "testing",
            },
            Object {
              "children": Array [],
              "dateAdded": 1610812309150,
              "dateGroupModified": 1610812309150,
              "id": "10",
              "index": 1,
              "parentId": "1",
              "title": "nothing",
            },
            Object {
              "children": Array [],
              "dateAdded": 1613247238088,
              "dateGroupModified": 1613247238088,
              "id": "12",
              "index": 2,
              "parentId": "1",
              "title": "asöldkaölskd",
            },
          ],
          "dateAdded": 1610201376440,
          "dateGroupModified": 1613247238089,
          "id": "1",
          "index": 0,
          "parentId": "0",
          "title": "Bookmarks Bar",
        }
      `)
    })

    it('handles getting brave bookmark bar', async () => {
      mocked(getBrowserName).mockReturnValue('Chrome')
      mocked(browser.bookmarks.getTree).mockResolvedValue([rootBraveBookmark])
      const bookmarkBar = await getBookmarkBar()
      expect(bookmarkBar).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "children": Array [],
                  "dateAdded": 1621144180052,
                  "dateGroupModified": 1621144180052,
                  "id": "840",
                  "index": 0,
                  "parentId": "839",
                  "title": "17",
                },
              ],
              "dateAdded": 1621144180051,
              "dateGroupModified": 1621144180052,
              "id": "839",
              "index": 0,
              "parentId": "1",
              "title": "test",
            },
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "children": Array [
                        Object {
                          "children": Array [
                            Object {
                              "children": Array [
                                Object {
                                  "dateAdded": 1621144180056,
                                  "id": "846",
                                  "index": 0,
                                  "parentId": "845",
                                  "title": "google",
                                  "url": "https://google.com/",
                                },
                              ],
                              "dateAdded": 1621144180055,
                              "dateGroupModified": 1621144180056,
                              "id": "845",
                              "index": 0,
                              "parentId": "844",
                              "title": "15",
                            },
                          ],
                          "dateAdded": 1621144180055,
                          "dateGroupModified": 1621144180055,
                          "id": "844",
                          "index": 0,
                          "parentId": "843",
                          "title": "13",
                        },
                      ],
                      "dateAdded": 1621144180054,
                      "dateGroupModified": 1621144180055,
                      "id": "843",
                      "index": 0,
                      "parentId": "842",
                      "title": "6",
                    },
                  ],
                  "dateAdded": 1621144180054,
                  "dateGroupModified": 1621144180054,
                  "id": "842",
                  "index": 0,
                  "parentId": "841",
                  "title": "14",
                },
              ],
              "dateAdded": 1621144180053,
              "dateGroupModified": 1621144180054,
              "id": "841",
              "index": 1,
              "parentId": "1",
              "title": "10",
            },
          ],
          "dateAdded": 1610201376440,
          "dateGroupModified": 1621144180060,
          "id": "1",
          "index": 0,
          "parentId": "0",
          "title": "Bookmarks bar",
        }
      `)
    })
  })
})
