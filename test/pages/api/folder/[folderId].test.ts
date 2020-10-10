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

  it('does not allow delete a folder that is not created by the user', async () => {
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

  it('returns 404 if method not DELETE', async () => {
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
    expect(status).not.toHaveBeenCalled()
    expect(end).not.toHaveBeenCalled()
    expect(deleteFolder).not.toHaveBeenCalled()
  })
})
