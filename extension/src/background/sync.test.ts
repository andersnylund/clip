import jestFetchMock from 'jest-fetch-mock'
import throttle from 'lodash/throttle'
import { mocked } from 'ts-jest/utils/index'
import { v4 as uuidv4 } from 'uuid'
import { browser } from 'webextension-polyfill-ts'
import { User } from '../../../shared/types'
import { firefoxRootBookmark, mockClips } from '../mock-objects'
import { updateSyncStatus } from './sync'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'b10a1020-249a-48cb-a82a-5072bf2254ca'),
}))

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
    },
  },
}))

jest.mock('lodash/throttle', () => jest.fn((fn) => fn))
jest.mock('../browser', () => ({ getBrowserName: () => 'Firefox' }))

describe('sync.ts', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(() => {
    mocked(browser.runtime.sendMessage).mockClear()
    mocked(browser.storage.local.set).mockClear()
    mocked(browser.storage.local.get).mockClear()
  })

  describe('updateSyncStatus', () => {
    it('does call throttle with the correct timeout', () => {
      expect(throttle).toHaveBeenCalledWith(updateSyncStatus, 30_000)
    })

    it('does not sync if sync disabled', async () => {
      mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
      const mockUser: User = {
        clips: [],
        id: 1,
        image: 'image',
        name: 'name',
        syncEnabled: false,
        syncId: null,
        username: 'username',
      }
      jestFetchMock.doMock(JSON.stringify(mockUser))
      await updateSyncStatus()
      expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
      expect(browser.storage.local.set).not.toHaveBeenCalled()
    })

    it('does not sync if sync ids match', async () => {
      mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
      const mockUser: User = {
        clips: [],
        id: 1,
        image: 'image',
        name: 'name',
        syncEnabled: true,
        syncId: uuidv4(),
        username: 'username',
      }
      jestFetchMock.doMock(JSON.stringify(mockUser))
      await updateSyncStatus()
      expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
      expect(browser.storage.local.set).not.toHaveBeenCalled()
    })

    it('does sync if sync ids do not match', async () => {
      mocked(browser.bookmarks.getTree).mockResolvedValue([firefoxRootBookmark])
      mocked(browser.bookmarks.create).mockImplementation(() => Promise.resolve({ id: 'id', title: 'title' }))
      mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
      const mockUser: User = {
        clips: mockClips,
        id: 1,
        image: 'image',
        name: 'name',
        syncEnabled: true,
        syncId: 'some new uuid',
        username: 'username',
      }
      jestFetchMock.doMock(JSON.stringify(mockUser))
      await updateSyncStatus()
      expect(browser.bookmarks.removeTree).toHaveBeenCalledTimes(5)
      expect(browser.bookmarks.create).toHaveBeenCalledTimes(2)
      expect(browser.bookmarks.create).toHaveBeenNthCalledWith(1, {
        index: 0,
        parentId: 'toolbar_____',
        title: 'parentTitle',
        url: undefined,
      })
      expect(browser.bookmarks.create).toHaveBeenNthCalledWith(2, {
        index: 0,
        parentId: 'id',
        title: 'title',
        url: undefined,
      })

      expect(browser.storage.local.set).toHaveBeenCalledWith({ syncEnabled: true, syncId: 'some new uuid' })
    })
  })
})
