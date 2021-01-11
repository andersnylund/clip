import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient, Folder } from '@prisma/client'

import handler from '../../../../src/pages/api/folder/[folderId]'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

describe('[folderId]', () => {
  it('returns 401 Unauthorized if no session', async () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler({} as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('returns 401 Unauthorized if user has no email', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: null } })
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler({} as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('returns 404 if method not DELETE or PUT', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })
    const end = jest.fn()
    const status = jest.fn().mockReturnValue({ end })

    const findUniqueUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique: findUniqueUser }

    const findUniqueFolder = jest.fn(() => ({ userId: '1' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findUnique: findUniqueFolder, delete: deleteFolder }

    await handler(
      ({ method: 'POST', query: { folderId: ['folderId1', 'folderId2'] } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(404)
    expect(end).toHaveBeenCalled()
    expect(deleteFolder).not.toHaveBeenCalled()
  })

  it('handles array query', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })
    const end = jest.fn()
    const status = jest.fn().mockReturnValue({ end })

    const findUniqueUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique: findUniqueUser }

    const findUniqueFolder = jest.fn(() => ({ userId: '1' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findUnique: findUniqueFolder, delete: deleteFolder }

    await handler(
      ({ method: 'DELETE', query: { folderId: ['folderId1', 'folderId2'] } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(204)
    expect(end).toHaveBeenCalled()
    expect(deleteFolder).toHaveBeenCalledWith({ where: { id: 'folderId1' } })
  })

  it('does not allow to modify a folder that is not created by the user', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })

    const findUniqueUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique: findUniqueUser }

    const findUniqueFolder = jest.fn(() => ({ userId: '2' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findUnique: findUniqueFolder, delete: deleteFolder }

    await handler(
      ({ method: 'DELETE', query: { folderId: 'folderId' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
  })

  describe('DELETE', () => {
    it('does not allow delete when user id not found', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => null)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const findUniqueFolder = jest.fn(() => ({}))
      const deleteFolder = jest.fn(() => ({}))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findUnique: findUniqueFolder, delete: deleteFolder }

      await handler(
        ({ method: 'DELETE', query: { folderId: 'folderId' } } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
    })

    it('deletes a folder', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const end = jest.fn()
      const status = jest.fn().mockReturnValue({ end })

      const findUniqueUser = jest.fn(() => ({ id: '1' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const findUniqueFolder = jest.fn(() => ({ userId: '1' }))
      const deleteFolder = jest.fn(() => ({}))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findUnique: findUniqueFolder, delete: deleteFolder }

      await handler(
        ({ method: 'DELETE', query: { folderId: 'folderId' } } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(status).toHaveBeenCalledWith(204)
      expect(end).toHaveBeenCalled()
      expect(deleteFolder).toHaveBeenCalledWith({ where: { id: 'folderId' } })
    })
  })

  describe('PUT', () => {
    it('updates a folder name', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => ({ id: 1 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const findUniqueFolder = jest.fn(() => ({ userId: 1 }))
      const updateFolder = jest.fn(() => ({ name: 'new name' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findUnique: findUniqueFolder, update: updateFolder }

      await handler(
        ({
          method: 'PUT',
          query: { folderId: 'folderId1' },
          body: { folderName: 'new name' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(updateFolder).toHaveBeenCalledWith({ data: { name: 'new name' }, where: { id: 'folderId1' } })
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({ userId: 1 })
    })

    it('updates the order of a folder', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => ({ id: 0 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const findUniqueFolder = jest.fn(() => mockFolders[0])
      const updateFolder = jest.fn(() => ({ name: 'new name' }))
      const findMany = jest.fn(() => mockFolders)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findUnique: findUniqueFolder, update: updateFolder, findMany }

      await handler(
        ({
          method: 'PUT',
          query: { folderId: '0' },
          body: { orderIndex: 1 },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(status).toHaveBeenCalledWith(200)
      expect(findMany).toHaveBeenCalledTimes(1)
      expect(findMany).toHaveBeenCalledWith({
        orderBy: {
          orderIndex: 'asc',
        },
        where: {
          userId: 0,
        },
      })
      expect(findUniqueFolder).toHaveBeenNthCalledWith(2, {
        where: {
          id: '0',
        },
      })
      expect(updateFolder).toHaveBeenCalledTimes(2)
      expect(updateFolder).toHaveBeenNthCalledWith(1, { data: { orderIndex: 0 }, where: { id: '1' } })
      expect(updateFolder).toHaveBeenNthCalledWith(2, { data: { orderIndex: 1 }, where: { id: '0' } })
      expect(json).toHaveBeenCalledWith({
        id: '0',
        name: 'folder0',
        orderIndex: 0,
        userId: 0,
      })
    })

    it('does not update anything if nothing in request body', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => ({ id: '1' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const findUniqueFolder = jest.fn(() => ({ userId: '1' }))
      const updateFolder = jest.fn(() => ({ name: 'new name' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findUnique: findUniqueFolder, update: updateFolder }

      await handler(
        ({
          method: 'PUT',
          query: { folderId: 'folderId1' },
          body: { something: 'else' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(updateFolder).not.toHaveBeenCalled()
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({ userId: '1' })
    })
  })
})

const mockFolders: Folder[] = [
  { id: '0', name: 'folder0', orderIndex: 0, userId: 0 },
  { id: '1', name: 'folder1', orderIndex: 1, userId: 0 },
]