// import jestFetchMock from 'jest-fetch-mock'
// import { mocked } from 'ts-jest/utils/index'
// import { v4 as uuidv4 } from 'uuid'
// import { browser } from 'webextension-polyfill-ts'
// import { ZodError } from 'zod'
// import { TOGGLE_SYNC } from '../../../shared/message-types'
// import { User } from '../../../shared/types'
// import { sync, syncListener } from './sync'

// jest.mock('uuid', () => ({
//   v4: jest.fn(() => 'b10a1020-249a-48cb-a82a-5072bf2254ca'),
// }))

// jest.mock('webextension-polyfill-ts', () => ({
//   browser: {
//     runtime: {
//       sendMessage: jest.fn(),
//     },
//     storage: {
//       local: {
//         set: jest.fn(),
//         get: jest.fn(),
//       },
//     },
//   },
// }))

// describe('sync.ts', () => {
//   beforeAll(jestFetchMock.enableMocks)

//   beforeEach(() => {
//     mocked(browser.runtime.sendMessage).mockClear()
//     mocked(browser.storage.local.set).mockClear()
//     mocked(browser.storage.local.get).mockClear()
//   })

//   describe('syncListener', () => {
//     it('handles TOGGLE_SYNC message', async () => {
//       const mockSetLocalStorage = mocked(browser.storage.local.set)
//       syncListener({ type: TOGGLE_SYNC, payload: { syncEnabled: true, syncId: uuidv4() } })
//       expect(mockSetLocalStorage).toHaveBeenCalledWith({
//         syncEnabled: true,
//         syncId: 'b10a1020-249a-48cb-a82a-5072bf2254ca',
//       })
//     })

//     it("doesn't allow invalid TOGGLE_SYNC message", async () => {
//       try {
//         syncListener({ type: TOGGLE_SYNC, payload: {} })
//       } catch (e) {
//         expect(e).toEqual(
//           new ZodError([
//             {
//               code: 'invalid_type',
//               expected: 'boolean',
//               received: 'undefined',
//               path: ['syncEnabled'],
//               message: 'Required',
//             },
//             {
//               code: 'invalid_type',
//               expected: 'string',
//               received: 'undefined',
//               path: ['syncId'],
//               message: 'Required',
//             },
//           ])
//         )
//       }
//     })

//     it('does not handle any other messages', () => {
//       const mockSetLocalStorage = mocked(browser.storage.local.set)
//       syncListener({ type: 'SOME_OTHER_MESSAGE', payload: { syncEnabled: true, syncId: uuidv4() } })
//       expect(mockSetLocalStorage).not.toHaveBeenCalled()
//     })
//   })

//   describe('sync', () => {
//     it('does not sync if sync disabled', async () => {
//       mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
//       const mockUser: User = {
//         clips: [],
//         id: 1,
//         image: 'image',
//         name: 'name',
//         syncEnabled: false,
//         syncId: null,
//         username: 'username',
//       }
//       jestFetchMock.doMock(JSON.stringify(mockUser))
//       await sync()
//       expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
//       expect(browser.storage.local.set).not.toHaveBeenCalled()
//     })

//     it('does not sync if sync ids match', async () => {
//       mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
//       const mockUser: User = {
//         clips: [],
//         id: 1,
//         image: 'image',
//         name: 'name',
//         syncEnabled: true,
//         syncId: uuidv4(),
//         username: 'username',
//       }
//       jestFetchMock.doMock(JSON.stringify(mockUser))
//       await sync()
//       expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
//       expect(browser.storage.local.set).not.toHaveBeenCalled()
//     })

//     it('does sync if sync ids do not match', async () => {
//       mocked(browser.storage.local.get).mockResolvedValue({ syncId: uuidv4() })
//       const mockUser: User = {
//         clips: [],
//         id: 1,
//         image: 'image',
//         name: 'name',
//         syncEnabled: true,
//         syncId: 'some new uuid',
//         username: 'username',
//       }
//       jestFetchMock.doMock(JSON.stringify(mockUser))
//       await sync()
//       expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ payload: [], type: 'EXPORT_BOOKMARKS' })
//       expect(browser.storage.local.set).toHaveBeenCalledWith({ syncEnabled: true, syncId: 'some new uuid' })
//     })
//   })
// })
