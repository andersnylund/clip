import jestFetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils/index'
import { browser } from 'webextension-polyfill-ts'
import { firefoxRootBookmark } from '../mock-objects'
import { updateClips } from './native-update'

jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    runtime: {
      sendMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn(),
      },
    },
    storage: {
      local: {
        set: jest.fn(),
        get: jest.fn(),
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
      getTree: jest.fn(),
      removeTree: jest.fn(),
      create: jest.fn(),
      onChanged: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
      onCreated: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
      onMoved: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  },
}))

jest.mock('lodash/throttle', () => jest.fn((fn) => fn))
jest.mock('../browser', () => ({ getBrowserName: () => 'Firefox' }))

describe('native-update.ts', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(() => {
    mocked(browser.runtime.sendMessage).mockClear()
    mocked(browser.storage.local.set).mockClear()
    mocked(browser.storage.local.get).mockClear()
  })

  describe('updateClips', () => {
    it('maps and updates the clips', async () => {
      mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
      await updateClips()
      const receivedBody = JSON.parse(mocked(fetch).mock.calls[0][1]?.body?.toString() ?? '')
      const expectedBody = [
        {
          clips: [
            {
              clips: [],
              collapsed: true,
              id: 'BdsM04swGwWH',
              index: 0,
              parentId: 'r9XXWlPBCuKr',
              title: 'clip.so – Share your clips',
              url: 'http://localhost:3000/clips',
            },
            {
              clips: [
                {
                  clips: [
                    {
                      clips: [],
                      collapsed: true,
                      id: '1C0zEWb_cqVk',
                      index: 0,
                      parentId: 'e6sbm4i5XjLC',
                      title: 'google',
                      url: 'https://google.com/',
                    },
                  ],
                  collapsed: true,
                  id: 'e6sbm4i5XjLC',
                  index: 0,
                  parentId: 'R_El0H_RQrjO',
                  title: 'aaargh',
                  url: null,
                },
              ],
              collapsed: true,
              id: 'R_El0H_RQrjO',
              index: 1,
              parentId: 'r9XXWlPBCuKr',
              title: 'clipception',
              url: null,
            },
          ],
          collapsed: true,
          id: 'r9XXWlPBCuKr',
          index: 0,
          parentId: 'toolbar_____',
          title: 'testing',
          url: null,
        },
        {
          clips: [],
          collapsed: true,
          id: 'Z4oGwYBAmnFK',
          index: 1,
          parentId: 'toolbar_____',
          title: 'clip.so – Share your clips',
          url: 'http://localhost:3000/clips',
        },
        {
          clips: [],
          collapsed: true,
          id: 'YIQzq0nFaoUf',
          index: 2,
          parentId: 'toolbar_____',
          title: 'nothing',
          url: null,
        },
        {
          clips: [],
          collapsed: true,
          id: 'xRLe8KZfNEEB',
          index: 3,
          parentId: 'toolbar_____',
          title: 'testing',
          url: 'http://asdf/',
        },
        {
          clips: [],
          collapsed: true,
          id: 'Du6LxlaViYtc',
          index: 4,
          parentId: 'toolbar_____',
          title: 'asöldkasöldk',
          url: null,
        },
      ]
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/clips/import', expect.anything())
      expect(receivedBody).toEqual(expectedBody)
    })
  })
})
