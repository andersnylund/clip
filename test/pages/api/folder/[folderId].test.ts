import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

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

  it('returns 404 if method not DELETE or PUT', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })
    const end = jest.fn()
    const status = jest.fn().mockReturnValue({ end })

    const findOneUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne: findOneUser }

    const findOneFolder = jest.fn(() => ({ userId: '1' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findOne: findOneFolder, delete: deleteFolder }

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

    const findOneUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne: findOneUser }

    const findOneFolder = jest.fn(() => ({ userId: '1' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findOne: findOneFolder, delete: deleteFolder }

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

    const findOneUser = jest.fn(() => ({ id: '1' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne: findOneUser }

    const findOneFolder = jest.fn(() => ({ userId: '2' }))
    const deleteFolder = jest.fn(() => ({}))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { findOne: findOneFolder, delete: deleteFolder }

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

      const findOneUser = jest.fn(() => ({}))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }

      const findOneFolder = jest.fn(() => ({}))
      const deleteFolder = jest.fn(() => ({}))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findOne: findOneFolder, delete: deleteFolder }

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

      const findOneUser = jest.fn(() => ({ id: '1' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }

      const findOneFolder = jest.fn(() => ({ userId: '1' }))
      const deleteFolder = jest.fn(() => ({}))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findOne: findOneFolder, delete: deleteFolder }

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
    it('updates a clip', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findOneUser = jest.fn(() => ({ id: '1' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }

      const findOneFolder = jest.fn(() => ({ userId: '1' }))
      const updateFolder = jest.fn(() => ({ name: 'new name' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findOne: findOneFolder, update: updateFolder }

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
      expect(json).toHaveBeenCalledWith({ name: 'new name' })
    })

    it('requires folderName in body', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findOneUser = jest.fn(() => ({ id: '1' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }

      const findOneFolder = jest.fn(() => ({ userId: '1' }))
      const updateFolder = jest.fn(() => ({ name: 'new name' }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.folder = { findOne: findOneFolder, update: updateFolder }

      await handler(
        ({
          method: 'PUT',
          query: { folderId: 'folderId1' },
          body: { something: 'else' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(updateFolder).not.toHaveBeenCalled()
      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({ message: 'Folder name required' })
    })
  })
})
